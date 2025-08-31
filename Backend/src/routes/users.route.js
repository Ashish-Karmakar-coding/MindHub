import express from 'express';
import {
    login,
    signup,
    logout,
    updateProfile,
    checkUser,
} from '../controllers/user.controller.js';

const Router = express.Router();

Router.post("/login",login)
Router.post("/signup",signup)
Router.get("/logout",logout)

Router.put("/update",updateProfile)

Router.get("/check-user",checkUser)

export default Router;