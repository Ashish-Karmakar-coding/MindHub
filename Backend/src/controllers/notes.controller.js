import {Note} from '../models/notes.model.js'

const addNotes = async(req,res) =>{
    const {title,content} = req.body;
    const userId = req.user._id;

    try {
        const newNote = new Note({
            user_id: userId,
            title,
            content
        })

        // Remove this unnecessary check - newNote will always be created
        // if(!newNote) return res.status(400).json({message: "Note not created"});

        await newNote.save();
        return res.status(201).json({message: "Note created successfully", note: newNote});

    } catch (error) {
        console.error('Error creating note:', error);
        return res.status(500).json({message: error.message});
    }
}

const getNotes = async(req,res) =>{
    const userId = req.user._id;
    try {
        const notes = await Note.find({user_id: userId}).sort({createdAt: -1});
        if (notes.length === 0) { // Fixed: check array length instead of truthiness
            return res.status(404).json({ message: 'No notes found' });
        }

        res.status(200).json(notes);

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const deleteNote = async (req,res) =>{
    const {id:noteId} = req.params;

    try {
        const deletedNote = await Note.findByIdAndDelete(noteId);
        if(!deletedNote) return res.status(404).json({message: "Note not found"});
        
        return res.status(200).json({message: "Note deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const editNote = async (req,res) =>{
    const {id:noteId} = req.params;
    const {title,content} = req.body;

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, content },
            { new: true } // This returns the updated document
        );
        
        if(!updatedNote) return res.status(404).json({message: "Note not found"});
        
        return res.status(200).json({message: "Note updated successfully", note: updatedNote}); // Fixed message
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export {addNotes,getNotes,deleteNote,editNote};