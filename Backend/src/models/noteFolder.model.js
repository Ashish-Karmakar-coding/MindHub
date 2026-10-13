import mongoose from 'mongoose';

const noteFolderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

export const NoteFolder = mongoose.model('NoteFolder', noteFolderSchema);
