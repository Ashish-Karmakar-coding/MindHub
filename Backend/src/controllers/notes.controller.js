import {Note} from '../models/notes.model.js'

const addNotes = async(req,res) =>{

    const {title,content} = req.body;
    const useId = req.user._id;

    try {

        const newNote = new Note({
            user_id: useId,
            title,
            content
        })

        if(!newNote) return res.status(400).json({message: "Note not created"});

        await newNote.save();
        return res.status(201).json({message: "Note created successfully", note: newNote});

    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}

const getNotes = async(req,res) =>{

}

const deleteNote = async (req,res) =>{

}

const editNote = async (req,res) =>{

}

export {addNotes,getNotes,deleteNote,editNote};