import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:{type:String, required:true},
  password:{type:String, required: true},
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'trans'], required: true },
  address: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
});

const User = mongoose.model("user", userSchema);


export default User;