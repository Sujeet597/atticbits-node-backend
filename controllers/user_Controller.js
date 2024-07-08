import UserDB from "../models/user_Model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const SECRET_KEY = "USERAPI";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, age, gender, address } = req.body;

    // Check if user already exists
    const existingUser = await UserDB.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create new user instance
    const newUser = new UserDB({
      username,
      email,
      password: hashedPassword,
      age,
      gender,
      address,
    });

    // Save user to the database
    await newUser.save();

    return res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;

    const skip = (page - 1) * limit;
    console.log(`Fetching users with limit: ${limit}, page: ${page}, skip: ${skip}`);

    const users = await UserDB.find().limit(limit).skip(skip);
    const totalUsers = await UserDB.countDocuments();

    return res.status(200).json({
      message: "All users data retrieved successfully.",
      data: users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserDB.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const userdata = {
      username: user.username,
      userId: user.id,
      email: user.email,
      age: user.age,
      gender: user.gender,
    };

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, userName: user.username }, SECRET_KEY, { expiresIn: "30d" });

    return res.status(200).json({ message: "Login successful", userdata, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await UserDB.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    return res.status(200).json({ message: "data updated successfully", data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const DeleteUser = await UserDB.findByIdAndDelete(id);
    if (!DeleteUser) {
      return res.status(400).json({ error: "somthing went" });
    }
    return res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};
