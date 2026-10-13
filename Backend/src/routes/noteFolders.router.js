import express from 'express';
import { tokenCheck } from '../middlewares/tokenCheck.middleware.js';
import { createNoteFolder, getAllNoteFolders, deleteNoteFolder } from '../controllers/noteFolders.controller.js';

const router = express.Router();

router.post('/', tokenCheck, createNoteFolder);
router.get('/', tokenCheck, getAllNoteFolders);
router.delete('/:folderId', tokenCheck, deleteNoteFolder);

export default router;
