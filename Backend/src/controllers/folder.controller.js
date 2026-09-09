import { Folder } from "../models/folder.model.js";
import { File } from "../models/file.model.js";
import { redis } from "../utils/redis.util.js";

const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    const userId = req.user._id;

    if (!folderName) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const alreadyExists = await Folder.findOne({
      user_id: userId,
      folderName: folderName,
    });
    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "Folder with this name already exists" });
    }

    const newFolder = new Folder({
      user_id: userId,
      folderName: folderName,
    });

    await newFolder.save();

    try {
      await redis.del(`folders:${userId}`);
    } catch (cacheErr) {
      console.error('Redis DEL Error:', cacheErr.message);
    }

    return res.status(201).json({ message: "Folder created successfully", folder: newFolder });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteFolder = async (req, res) => {
  const { folderId } = req.params;
  const userId = req.user._id;
  try {
    const folder = await Folder.findByIdAndDelete(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    try {
      await redis.del(`folders:${userId}`);
      await redis.del(`folder_files:${folderId}`);
    } catch (cacheErr) {
      console.error('Redis DEL Error:', cacheErr.message);
    }

    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllFolders = async (req, res) => {
  try {
    const userId = req.user._id;
    const cacheKey = `folders:${userId}`;

    let cached = null;
    try {
      cached = await redis.get(cacheKey);
    } catch (cacheErr) {
      console.error('Redis GET Error:', cacheErr.message);
    }

    if (cached) {
      return res.status(200).json(cached);
    }

    const folders = await Folder.find({ user_id: userId }).sort({
      createdAt: -1,
    });

    try {
      await redis.set(cacheKey, folders, { ex: 300 });
    } catch (cacheErr) {
      console.error('Redis SET Error:', cacheErr.message);
    }

    res.status(200).json(folders);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllFileInFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const cacheKey = `folder_files:${folderId}`;

    let cached = null;
    try {
      cached = await redis.get(cacheKey);
    } catch (cacheErr) {
      console.error('Redis GET Error:', cacheErr.message);
    }

    if (cached) {
      return res.status(200).json(cached);
    }

    const folder = await Folder.findById(folderId).populate("files");

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const result = {
      success: true,
      folderName: folder.folderName,
      files: folder.files,
    };

    try {
      await redis.set(cacheKey, result, { ex: 300 });
    } catch (cacheErr) {
      console.error('Redis SET Error:', cacheErr.message);
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const addFileToFolder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fileId, folderId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Unauthorized" });
    }
    if (!folderId) {
      return res.status(400).json({ message: "Folder is required" });
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const folder = await Folder.findByIdAndUpdate(
      folderId,
      { $push: { files: file._id } },
      { new: true }
    ).populate("files");

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    try {
      await redis.del(`folders:${userId}`);
      await redis.del(`folder_files:${folderId}`);
    } catch (cacheErr) {
      console.error('Redis DEL Error:', cacheErr.message);
    }

    res.json({ message: "File added to folder", folder });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeFileFromFolder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { folderId, fileId } = req.body;

    const folder = await Folder.findByIdAndUpdate(
      folderId,
      { $pull: { files: fileId } },
      { new: true }
    ).populate("files");

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    try {
      await redis.del(`folders:${userId}`);
      await redis.del(`folder_files:${folderId}`);
    } catch (cacheErr) {
      console.error('Redis DEL Error:', cacheErr.message);
    }

    res.json({ message: "File removed from folder", folder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createFolder,
  deleteFolder,
  getAllFolders,
  getAllFileInFolder,
  addFileToFolder,
  removeFileFromFolder,
};
