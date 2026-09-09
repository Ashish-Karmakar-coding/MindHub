import { Note } from '../models/notes.model.js';
import { redis } from '../utils/redis.util.js';

const addNotes = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user._id;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const newNote = new Note({
            user_id: userId,
            title,
            content
        });

        await newNote.save();
        
        try {
            await redis.del(`notes:${userId}`);
        } catch (cacheErr) {
            console.error('Redis DEL Error:', cacheErr.message);
        }

        return res.status(201).json({ message: 'Note created successfully', note: newNote });
    } catch (error) {
        console.error('Error creating note:', error);
        return res.status(500).json({ message: error.message });
    }
};

const getNotes = async (req, res) => {
    const userId = req.user._id;
    const cacheKey = `notes:${userId}`;

    try {
        let cached = null;
        try {
            cached = await redis.get(cacheKey);
        } catch (cacheErr) {
            console.error('Redis GET Error:', cacheErr.message);
        }

        if (cached) {
            return res.status(200).json(cached);
        }

        const notes = await Note.find({ user_id: userId }).sort({ createdAt: -1 });

        try {
            await redis.set(cacheKey, notes, { ex: 300 });
        } catch (cacheErr) {
            console.error('Redis SET Error:', cacheErr.message);
        }

        res.status(200).json(notes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteNote = async (req, res) => {
    const { id: noteId } = req.params;
    const userId = req.user._id;

    try {
        const deletedNote = await Note.findByIdAndDelete(noteId);
        if (!deletedNote) return res.status(404).json({ message: 'Note not found' });

        try {
            await redis.del(`notes:${userId}`);
        } catch (cacheErr) {
            console.error('Redis DEL Error:', cacheErr.message);
        }

        return res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const editNote = async (req, res) => {
    const { id: noteId } = req.params;
    const { title, content } = req.body;
    const userId = req.user._id;

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, content },
            { new: true }
        );

        if (!updatedNote) return res.status(404).json({ message: 'Note not found' });

        try {
            await redis.del(`notes:${userId}`);
        } catch (cacheErr) {
            console.error('Redis DEL Error:', cacheErr.message);
        }

        return res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { addNotes, getNotes, deleteNote, editNote };