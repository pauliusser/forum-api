import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true, min: 3 },
  email: { type: String, required: true, min: 3 },
  password: { type: String, required: true, min: 3 },
  profile_picture: { type: String, required: true, min: 3 },
  status: { type: String, default: "user" },
});

export default mongoose.model("User", userSchema);
