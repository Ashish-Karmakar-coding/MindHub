import express from 'express';
import {uploadFile,getFiles,deleteFile} from '../controllers/folders.controller.js';
import { tokenCheck } from '../middlewares/tokenCheck.middleware.js';


const router = express.Router();

router.post('/upload',tokenCheck,uploadFile);
router.get('/getfiles',tokenCheck,getFiles);
router.delete('/delete/:id',tokenCheck,deleteFile);

export default router;