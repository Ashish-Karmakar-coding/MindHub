import {cloudinary} from '../utils/cloudinary.util.js';
import {File} from '../models/file.model.js';

const uploadFile = async (req,res) =>{

    const userId = req.user._id

try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "my_uploads",
      resource_type: "auto", // auto-detect (image, pdf, video, etc.)
    });

    const file = await File.create({
      filename: req.file.originalname,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: req.file.size,
      uploadedBy: userId || null, // if you track users
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getFiles = async (req,res) =>{
    const userId = req.user._id
    try {

        const files = await File.find({ uploadedBy: userId }).sort({ createdAt: -1 });
        if (!files) {
            return res.status(404).json({ message: "No files found." });
        }

        res.status(200).json(files);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteFile = async (req,res) =>{

    try {
    const { id } = req.params; // MongoDB file _id

    // 1. Find file in DB
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // 2. Delete from Cloudinary
    await cloudinary.uploader.destroy(file.public_id, {
      resource_type: "auto", // handles images, pdfs, videos, etc.
    });

    // 3. Delete from MongoDB
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

export {uploadFile,getFiles,deleteFile};