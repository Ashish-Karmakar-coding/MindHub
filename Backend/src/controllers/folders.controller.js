import {cloudinary} from '../utils/cloudinary.util.js';
import {File} from '../models/folders.model.js';

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

}

const deleteFile = async (req,res) =>{

}

export {uploadFile,getFiles,deleteFile};