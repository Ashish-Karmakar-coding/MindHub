import { LinkFolder } from '../models/linkFolder.model.js';
import { Link } from '../models/links.model.js';
import { redis } from '../utils/redis.util.js';

const createLinkFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const alreadyExists = await LinkFolder.findOne({ user_id: userId, name: name.trim() });
    if (alreadyExists) {
      return res.status(409).json({ message: 'A folder with this name already exists' });
    }

    const folder = await LinkFolder.create({ user_id: userId, name: name.trim() });

    try { await redis.del(`link-folders:${userId}`); } catch (e) { console.error('Redis DEL error:', e.message); }

    return res.status(201).json({ message: 'Folder created', folder: { ...folder.toObject(), linkCount: 0 } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllLinkFolders = async (req, res) => {
  try {
    const userId = req.user._id;
    const cacheKey = `link-folders:${userId}`;

    let cached = null;
    try { cached = await redis.get(cacheKey); } catch (e) { console.error('Redis GET error:', e.message); }
    if (cached) return res.status(200).json(cached);

    const folders = await LinkFolder.find({ user_id: userId }).sort({ createdAt: -1 });

    const foldersWithCount = await Promise.all(
      folders.map(async (f) => {
        const linkCount = await Link.countDocuments({ folder_id: f._id });
        return { ...f.toObject(), linkCount };
      })
    );

    try { await redis.set(cacheKey, foldersWithCount, { ex: 300 }); } catch (e) { console.error('Redis SET error:', e.message); }

    return res.status(200).json(foldersWithCount);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteLinkFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user._id;

    const folder = await LinkFolder.findOneAndDelete({ _id: folderId, user_id: userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    // Ungroup all links in this folder
    await Link.updateMany({ folder_id: folderId }, { $set: { folder_id: null } });

    try {
      await redis.del(`link-folders:${userId}`);
      await redis.del(`links:${userId}`);
    } catch (e) { console.error('Redis DEL error:', e.message); }

    return res.status(200).json({ message: 'Folder deleted. Links are now ungrouped.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { createLinkFolder, getAllLinkFolders, deleteLinkFolder };
