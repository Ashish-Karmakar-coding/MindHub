import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({

    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    folderName:{
        type: String,
        required: true
    },
    files:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }]

},{timestamps: true});

export const Folder = mongoose.model('Folder', folderSchema);