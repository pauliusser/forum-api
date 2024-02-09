import mongoose from "mongoose";

const topicSchema = mongoose.Schema({
  title: { type: String, required: true, min: 3 },
  description: { type: String, required: true, min: 3 },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // reference to the User who created the topic
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Topic", topicSchema);
