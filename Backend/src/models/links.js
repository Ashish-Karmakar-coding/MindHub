import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url:{
        type: String,
        required: true
    }
}, { timestamps: true })