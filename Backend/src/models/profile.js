import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true    
    },
    password:{
        type: Number,
        required: true
    }
}, { timestamps: true });

export const Profile = mongoose.model("Profile", profileSchema);