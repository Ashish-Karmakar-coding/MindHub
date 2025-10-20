import { Link } from "../models/links.model.js";

const addLink = async (req, res) => {
    const { url } = req.body;
    const userId = req.user._id;

    if (!url) {
        return res.status(400).json({ message: 'Bad Request: URL is required' });
    }

    try {
        const alreadyExists = await Link.findOne({ user_id: userId, url: url });
        if (alreadyExists) {
            return res.status(409).json({ message: 'Conflict: Link already exists' });
        }

        const newLink = new Link({
            user_id: userId,
            url: url
        });
        await newLink.save();
        return res.status(201).json({ message: 'Link added successfully', link: newLink });

    } catch (error) {
        console.error('Error adding link:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getLinks = async (req, res) => {
    const userId = req.user._id;
    try {
        const links = await Link.find({ user_id: userId }).sort({ createdAt: -1 });

        if (!links || links.length === 0) {
            return res.status(404).json({ message: 'No links found' });
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
        return res.status(200).json({ message: 'Link deleted successfully' });

    } catch (error) {
        console.error('Error deleting link:', error);
        
        // Handle invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid link ID format' });
        }
        
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { addLink, getLinks, deleteLink };