import express from 'express';
import {uploadFile,getFiles,deleteFile} from '../controllers/file.controller.js';
import { tokenCheck } from '../middlewares/tokenCheck.middleware.js';
import { upload } from '../middlewares/multer.js';


const router = express.Router();

router.post('/upload',upload.single("file"),tokenCheck,uploadFile);
router.get('/getfiles',tokenCheck,getFiles);
router.delete('/delete/:id',tokenCheck,deleteFile);

export default router;