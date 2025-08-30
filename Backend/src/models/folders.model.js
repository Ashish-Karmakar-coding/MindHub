import mongoose from "mongoose";
import { User } from './user.model.js';

const folderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Folder = mongoose.model("Folder", folderSchema);