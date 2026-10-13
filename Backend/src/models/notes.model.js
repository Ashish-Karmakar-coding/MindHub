import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    folder_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NoteFolder',
        default: null,
    },
}, { timestamps: true });

export const Note = mongoose.model('Note', noteSchema);