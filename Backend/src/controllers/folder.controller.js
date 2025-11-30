import { Folder } from "../models/folder.model.js";
import { File } from "../models/file.model.js";
import { User } from "../models/user.model.js";

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

    return res.status(201).json({ message: "Folder created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteFolder = async (req, res) => {
  const { folderId } = req.params;
  const userId = req.user._id;
  try {
    const folder = await Folder.findOne({ _id: folderId, user_id: userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found or access denied" });
    }

    await Folder.findByIdAndDelete(folderId);
    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllFolders = async (req, res) => {
  try {
    const userId = req.user._id;

    const folders = await Folder.find({ user_id: userId }).sort({
      createdAt: -1,
    });

    if (!folders || folders.length === 0) {
      return res.status(404).json({ message: "Folders not found" });
    }

    res.status(200).json(folders);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getAllFileInFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user._id;

    const folder = await Folder.findOne({ _id: folderId, user_id: userId }).populate("files");

    if (!folder) {
      return res.status(404).json({ message: "Folder not found or access denied" });
    }

    return res.status(200).json({
      success: true,
      folderName: folder.folderName,
      files: folder.files, // all file details populated
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
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

    // Check if file belongs to the user
    if (file.uploadedBy && file.uploadedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: You don't have permission to add this file" });
    }

    const folder = await Folder.findOne({ _id: folderId, user_id: userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found or access denied" });
    }

    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { $push: { files: file._id } }, // Push file into array
      { new: true } // Return updated folder
    ).populate("files"); // optional: populate files info

    res.json({ message: "File added to folder", folder: updatedFolder });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeFileFromFolder = async (req, res) => {
  try {
    const { folderId, fileId } = req.body; // IDs from frontend
    const userId = req.user._id;

    const folder = await Folder.findOne({ _id: folderId, user_id: userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found or access denied" });
    }

    // Remove fileId from folder.files
    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { $pull: { files: fileId } }, // Remove file reference
      { new: true } // Return updated folder
    ).populate("files"); // optional: show remaining files

    res.json({ message: "File removed from folder", folder: updatedFolder });
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
