import mongoose from "mongoose";

const voteSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // reference to the User who voted
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // reference to the Post voted on
  type: { type: String, enum: ["upvote", "downvote"] }, // type of vote (upvote or downvote)
});

export default mongoose.model("Vote", voteSchema);
