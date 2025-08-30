import mongoose from 'mongoose';
import { User } from './user.model.js';

const noteSchema = new mongoose.Schema({

    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
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