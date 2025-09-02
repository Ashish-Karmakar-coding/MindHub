import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },   // Original file name
    url: { type: String, required: true },        // Cloudinary URL
    public_id: { type: String, required: true },  // Cloudinary ID (needed for delete/update)
    format: { type: String },                     // File type (jpg, png, pdf, etc.)
    size: { type: Number },                       // File size in bytes
    uploadedBy: {                                 // Link file to a user (optional)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const File = mongoose.model("File", fileSchema);