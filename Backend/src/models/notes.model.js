import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Changed from "Profile" to "User"
        required: true
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
    },
}, { timestamps: true });

export const Note = mongoose.model('Note', noteSchema);