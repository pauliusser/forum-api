import mongoose from "mongoose";

const topicSchema = mongoose.Schema({
  title: { type: String, required: true, min: 3 },
  initialPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // reference to initial post
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // reference to the User who created the topic
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Topic", topicSchema);
