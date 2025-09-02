import express from 'express';
import {addNotes,getNotes,deleteNote,editNote} from '../controllers/notes.controller.js';
import { tokenCheck } from '../middlewares/tokenCheck.middleware.js';

const router = express.Router()

router.post("/addNotes",tokenCheck, addNotes);
router.get("/getNotes",tokenCheck, getNotes);
router.delete("/deleteNote/:id",tokenCheck, deleteNote);
router.put("/editNote/:id",tokenCheck, editNote);

export default router;