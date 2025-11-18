import mongoose from 'mongoose';
import { User } from './user.model.js';

const linkSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required:true
    },
    description:{
        type:String,
    }
}, { timestamps: true })

export const Link = mongoose.model('Link', linkSchema);