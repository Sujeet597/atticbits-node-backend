import { registerUser, loginUser, updateUser, deleteUser, getAllUser} from "../controllers/user_Controller.js";
import express from "express";
const router = express.Router();

//user Register Router
router.post("/register", registerUser);

//user Login Router
router.post("/login", loginUser);

//Update user data

router.post("/update/:id", updateUser);

//Delete user Routes

router.delete("/delete/:id", deleteUser);

//get all users
router.get("/get-all-users", getAllUser);



export default router;
