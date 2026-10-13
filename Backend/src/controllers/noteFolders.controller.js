import { NoteFolder } from '../models/noteFolder.model.js';
import { Note } from '../models/notes.model.js';
import { redis } from '../utils/redis.util.js';

const createNoteFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const alreadyExists = await NoteFolder.findOne({ user_id: userId, name: name.trim() });
    if (alreadyExists) {
      return res.status(409).json({ message: 'A folder with this name already exists' });
    }

    const folder = await NoteFolder.create({ user_id: userId, name: name.trim() });

    try { await redis.del(`note-folders:${userId}`); } catch (e) { console.error('Redis DEL error:', e.message); }

    return res.status(201).json({ message: 'Folder created', folder: { ...folder.toObject(), noteCount: 0 } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllNoteFolders = async (req, res) => {
  try {
    const userId = req.user._id;
    const cacheKey = `note-folders:${userId}`;

    let cached = null;
    try { cached = await redis.get(cacheKey); } catch (e) { console.error('Redis GET error:', e.message); }
    if (cached) return res.status(200).json(cached);

    const folders = await NoteFolder.find({ user_id: userId }).sort({ createdAt: -1 });

    const foldersWithCount = await Promise.all(
      folders.map(async (f) => {
        const noteCount = await Note.countDocuments({ folder_id: f._id });
        return { ...f.toObject(), noteCount };
      })
    );

    try { await redis.set(cacheKey, foldersWithCount, { ex: 300 }); } catch (e) { console.error('Redis SET error:', e.message); }

    return res.status(200).json(foldersWithCount);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteNoteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user._id;

    const folder = await NoteFolder.findOneAndDelete({ _id: folderId, user_id: userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Ungroup all notes in this folder (set folder_id to null)
    await Note.updateMany({ folder_id: folderId }, { $set: { folder_id: null } });

    try {
      await redis.del(`note-folders:${userId}`);
      await redis.del(`notes:${userId}`);
    } catch (e) { console.error('Redis DEL error:', e.message); }

    return res.status(200).json({ message: 'Folder deleted. Notes are now ungrouped.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { createNoteFolder, getAllNoteFolders, deleteNoteFolder };
