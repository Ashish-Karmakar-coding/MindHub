import express from 'express';
import { tokenCheck } from '../middlewares/tokenCheck.middleware.js';
import { createLinkFolder, getAllLinkFolders, deleteLinkFolder } from '../controllers/linkFolders.controller.js';

const router = express.Router();

router.post('/', tokenCheck, createLinkFolder);
router.get('/', tokenCheck, getAllLinkFolders);
router.delete('/:folderId', tokenCheck, deleteLinkFolder);

export default router;
