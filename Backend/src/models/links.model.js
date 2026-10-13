import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    folder_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LinkFolder',
        default: null,
    },
}, { timestamps: true });

export const Link = mongoose.model('Link', linkSchema);