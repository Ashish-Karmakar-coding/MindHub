import express from 'express';
import {
    addLink,
    getLinks,
} from '../controllers/links.controller.js';
import {tokenCheck} from '../middlewares/tokenCheck.middleware.js'

const router = express.Router();

router.put("/add-link",tokenCheck,addLink)

router.get("/get-link",tokenCheck,getLinks)

export default router;