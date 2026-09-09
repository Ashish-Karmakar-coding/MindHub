import { cloudinary, uploadBuffer } from '../utils/cloudinary.util.js';
import { File } from '../models/file.model.js';

const uploadFile = async (req, res) => {
  const userId = req.user._id;

  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  try {
    // Upload buffer directly to Cloudinary (no temp disk needed)
    const result = await uploadBuffer(req.file.buffer);

    const file = await File.create({
      filename: req.file.originalname,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: req.file.size,
      uploadedBy: userId,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFiles = async (req, res) => {
  const userId = req.user._id;
  try {
    const files = await File.find({ uploadedBy: userId }).sort({ createdAt: -1 });

    res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    await cloudinary.uploader.destroy(file.public_id, {
      resource_type: 'auto',
    });

    await file.deleteOne();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { uploadFile, getFiles, deleteFile };