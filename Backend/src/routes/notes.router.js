import express from 'express';
import {addNotes,getNotes,deleteNote,editNote} from '../controllers/notes.controller.js';

const router = express.Router()

router.post("/addNotes", addNotes);
router.get("/getNotes", getNotes);
router.delete("/deleteNote/:id", deleteNote);
router.put("/editNote/:id", editNote);

export default router;