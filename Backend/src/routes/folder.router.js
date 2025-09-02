import express from 'express';
import {createFolder, deleteFolder, getAllFolders, addFileToFolder, removeFileFromFolder} from '../controllers/folder.controller.js';
import { tokenCheck } from '../middlewares/tokenCheck.middleware.js';

const router = express.Router()

router.post("/create-folder",tokenCheck, createFolder);
router.delete("/delete-folder/:folderId",tokenCheck, deleteFolder);
router.get("/get-all-folders",tokenCheck, getAllFolders);
router.post("/add-file",tokenCheck, addFileToFolder);
router.post("/remove-file",tokenCheck, removeFileFromFolder);

export default router;