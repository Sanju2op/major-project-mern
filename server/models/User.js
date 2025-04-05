import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true }, // Clerk User ID
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
export default User;
