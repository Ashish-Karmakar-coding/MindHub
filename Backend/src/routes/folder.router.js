import express from 'express';
import {createFolder, deleteFolder, getAllFolders, addFileToFolder, removeFileFromFolder} from '../controllers/folder.controller.js';
import { tokenCheck } from '../middlewares/tokenCheck.middleware.js';

const router = express.Router()

router.post("/create-folder", createFolder);
router.delete("/delete-folder/:folderId", deleteFolder);
router.get("/get-all-folders", getAllFolders);
router.post("/add-file", addFileToFolder);
router.post("/remove-file", removeFileFromFolder);

export default router;