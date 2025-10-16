import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.util.js";

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('Signup attempt:', { name, email }); // Debug log

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

    // Generate token before saving
    generateToken(newUser._id, res);
    
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
    console.error('Signup error:', error); // Detailed error log
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email }); // Debug log

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // FIX: Added await for bcrypt.compare
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV !== 'development',
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

const updateProfile = async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id;
  
  console.log('Update profile attempt:', { userId, name });

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  
  try {
    // FIX: Added const declaration
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

const checkUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Check user error:', error);
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

export { login, signup, logout, updateProfile, checkUser };