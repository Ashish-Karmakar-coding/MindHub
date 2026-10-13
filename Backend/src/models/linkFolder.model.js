import mongoose from 'mongoose';

const linkFolderSchema = new mongoose.Schema({
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

export const LinkFolder = mongoose.model('LinkFolder', linkFolderSchema);
