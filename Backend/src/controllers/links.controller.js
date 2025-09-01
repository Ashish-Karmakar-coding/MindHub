import { Link } from "../models/links.model.js";

const addLink = async (req,res) =>{

    const {url} = req.body;
    const userId = req.user._id;

    if(!url){
        return res.status(400).json({message: 'Bad Request: URL is required'});
    }

    try {
        
        alreadyExists = await Link.findOne({user_id: userId, url: url});
        if(alreadyExists){
            return res.status(409).json({message: 'Conflict: Link already exists'});
        }

        const newLink = new Link({
            user_id: userId,
            url: url
        })
        await newLink.save();
        return res.status(201).json({message: 'Link added successfully', link: newLink});

    } catch (error) {
        return res.status(500).json({message: 'Internal Server Error',})
    }
    

}

const getLinks = async (req,res) =>{

}

export {addLink,getLinks};