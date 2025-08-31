import express from 'express';
import {
    login,
    signup,
    logout,
    updateProfile,
    checkUser,
} from '../controllers/user.controller.js';
import {tokenCheck} from '../middlewares/tokenCheck.middleware.js'

const Router = express.Router();

Router.post("/login",login)
Router.post("/signup",signup)
Router.get("/logout",logout)

Router.put("/update",tokenCheck,updateProfile)

Router.get("/check-user",tokenCheck,checkUser)

export default Router;