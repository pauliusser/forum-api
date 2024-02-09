import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  content: { type: String, required: true, min: 3 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // reference to the User who authored the post
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" }, // reference to the Topic the post belongs to
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);
