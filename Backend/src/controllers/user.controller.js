import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.utiljs";

const signup = async (req, res) => {

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {

    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }

    await newUser.save();

    return res.status(201).json({
         message: "User created successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" , error: error.message });
  }
};

const login = async (req, res) => {

    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    try {
        
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }

        const isPasswordCorrect = bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid password"})
        }

        generateToken(user._id,res)
        
        return res.status(200).json({
            message:"Login successful",
            user:{
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" , error: error.message });
    }
};

const logout = async (req, res) => {};

const updateProfile = async (req, res) => {};

const checkUser = async (req, res) => {};

export { login, signup, logout, updateProfile, checkUser };
