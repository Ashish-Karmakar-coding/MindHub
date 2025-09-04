import { Folder } from "../models/folder.model.js";
import { File } from "../models/file.model.js";
import { User } from "../models/user.model.js";

const createFolder = async (req,res) =>{

    try {
        const {folderName} = req.body;
        const userId = req.user._id; 
    
        if(!folderName){
            return res.status(400).json({message: "Folder name is required"});
        }

        alreadyExists = await Folder.findOne({user_id: userId, folderName: folderName});
        if(alreadyExists){
            return res.status(400).json({message: "Folder with this name already exists"});
        }

        const newFolder = new Folder({
            user_id: userId,
            folderName: folderName
        })

        await newFolder.save()

        return res.status(201).json({message: "Folder created successfully"});
        
    } catch (error) {
        return res.status(500).json({message: "Server Error"});
    }


}

const deleteFolder = async (req,res) =>{

    const {folderId} = req.params
    try {
        
        const folder = await Folder.findByIdAndDelete(folderId)
        if (!folder) {
            return res.status(402).json({message:"Folder not found"})
        }

        return res.status(200).message({message:"Folder deleted successfully"})
        

    } catch (error) {
        return res.status(500).json({message:error.message})
    }


} 

const getAllFolders = async (req,res) =>{

    try {
        const userId = req.user._id

        const folders = await Folder.find({user_id:userId}).sort({createdAt: -1})
        
        if (!folders) {
            return res.status(402).json({message:"Folders not found"})
        }

        res.status(201).json(folders)

    } catch (error) {
        return res.status(500).json({message: "Server Error"});
    }

}

const getAllFileInFolder = async (req,res) =>{

}

const addFileToFolder = async(req,res) =>{

} 

const removeFileFromFolder = async(req,res) =>{

}

export {createFolder, deleteFolder, getAllFolders, getAllFileInFolder , addFileToFolder, removeFileFromFolder};