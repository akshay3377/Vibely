import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  resumeText: { type: String, required: true },
  fileName: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);