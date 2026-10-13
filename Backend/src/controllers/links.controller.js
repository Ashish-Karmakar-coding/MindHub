import { Link } from '../models/links.model.js';
import { redis } from '../utils/redis.util.js';

const addLink = async (req, res) => {
    const { title, url, description, folder_id } = req.body;
    const userId = req.user._id;

    if (!url || !title) {
        return res.status(400).json({ message: 'Bad Request: URL and Title are required' });
    }

    try {
        const alreadyExists = await Link.findOne({ user_id: userId, url: url });
        if (alreadyExists) {
            return res.status(409).json({ message: 'Conflict: Link already exists' });
        }

        const newLink = new Link({
            user_id: userId,
            url: url,
            title: title,
            description: description,
            folder_id: folder_id || null,
        });
        await newLink.save();

        try {
            await redis.del(`links:${userId}`);
            if (folder_id) await redis.del(`link-folders:${userId}`);
        } catch (cacheErr) {
            console.error('Redis DEL Error:', cacheErr.message);
        }

        return res.status(201).json({ message: 'Link added successfully', link: newLink });
    } catch (error) {
        console.error('Error adding link:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getLinks = async (req, res) => {
    const userId = req.user._id;
    const cacheKey = `links:${userId}`;

    try {
        let cached = null;
        try {
            cached = await redis.get(cacheKey);
        } catch (cacheErr) {
            console.error('Redis GET Error:', cacheErr.message);
        }

        if (cached) {
            const parsedCache = typeof cached === 'string' ? JSON.parse(cached) : cached;
            return res.status(200).json(parsedCache);
        }

        const links = await Link.find({ user_id: userId }).sort({ createdAt: -1 });

        try {
            await redis.set(cacheKey, JSON.stringify(links), { ex: 300 });
        } catch (cacheErr) {
            console.error('Redis SET Error:', cacheErr.message);
        }

        res.status(200).json(links);
    } catch (error) {
        console.error('Error fetching links:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteLink = async (req, res) => {
    const { linkId } = req.params;
    const userId = req.user._id;

    if (!linkId) {
        return res.status(400).json({ message: 'Bad Request: Link ID is required' });
    }

    try {
        const link = await Link.findOne({ _id: linkId, user_id: userId });

        if (!link) {
            return res.status(404).json({ message: 'Link not found or access denied' });
        }

        await Link.findByIdAndDelete(linkId);

        try {
            await redis.del(`links:${userId}`);
            if (link.folder_id) await redis.del(`link-folders:${userId}`);
        } catch (cacheErr) {
            console.error('Redis DEL Error:', cacheErr.message);
        }

        return res.status(200).json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error('Error deleting link:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid link ID format' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const editLink = async (req, res) => {
    const { linkId } = req.params;
    const { title, url, description, folder_id } = req.body;
    const userId = req.user._id;

    if (!linkId) {
        return res.status(400).json({ message: 'Bad Request: Link ID is required' });
    }

    try {
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (url !== undefined) updateData.url = url;
        if (description !== undefined) updateData.description = description;
        if (folder_id !== undefined) updateData.folder_id = folder_id || null;

        const updatedLink = await Link.findOneAndUpdate(
            { _id: linkId, user_id: userId },
            updateData,
            { new: true }
        );

        if (!updatedLink) {
            return res.status(404).json({ message: 'Link not found or access denied' });
        }

        try {
            await redis.del(`links:${userId}`);
            await redis.del(`link-folders:${userId}`);
        } catch (cacheErr) {
            console.error('Redis DEL Error:', cacheErr.message);
        }

        return res.status(200).json({ message: 'Link updated successfully', link: updatedLink });
    } catch (error) {
        console.error('Error updating link:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid link ID format' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { addLink, getLinks, deleteLink, editLink };