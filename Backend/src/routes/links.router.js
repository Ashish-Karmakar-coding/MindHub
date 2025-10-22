import express from 'express';
import {
    addLink,
    getLinks,
    deleteLink 
} from '../controllers/links.controller.js';
import {tokenCheck} from '../middlewares/tokenCheck.middleware.js'

const router = express.Router();

router.get("/get-link", tokenCheck, getLinks);
router.post("/add-link", tokenCheck, addLink);
// Change to use URL parameter instead of request body
router.delete("/delete-link/:linkId", tokenCheck, deleteLink);

export default router;