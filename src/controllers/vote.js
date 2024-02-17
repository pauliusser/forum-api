import voteModel from "../models/vote.js";
import postModel from "../models/post.js";

const CREATE_VOTE = async (req, res) => {
  try {
    const vote = new voteModel({
      user: req.body.userId,
      post: req.body.post,
      type: req.body.type,
    });

    const postObj = await postModel.findById(req.body.post);
    if (!postObj) {
      return res.status(404).json({ message: "Post not found" });
    }

    let voteValue = 0;
    if (req.body.type === "upvote") {
      voteValue = 1;
    } else if (req.body.type === "downvote") {
      voteValue = -1;
    } else {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    postObj.votes += voteValue;
    const updatedPost = await postObj.save();

    const voteResponse = await vote.save();

    console.log("create vote");
    return res
      .status(200)
      .json({ message: "vote_created", vote: voteResponse, post: updatedPost });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

const UPDATE_VOTE = async (req, res) => {
  try {
    console.log({
      postId: req.params.id,
      userId: req.body.userId,
    });
    const updatedVote = await voteModel.findOneAndUpdate(
      { post: req.params.id, user: req.body.userId },
      { ...req.body },
      { new: true }
    );
    const postObj = await postModel.findById(req.params.id);
    const voteValue =
      req.body.type === "upvote" ? 2 : req.body.type === "downvote" ? -2 : 0; // 2 ir -2 nes reiksme pasikeicia is +1 iki -1 arba atvirksciai
    postObj.votes += voteValue;
    const updatedPost = await postObj.save();

    console.log("update vote endpoint not finished");
    return res.status(200).json({
      message: "vote updated",
      updatedVote: updatedVote,
      updatedPost: updatedPost,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

const DELETE_VOTE_BY_POST_ID = async (req, res) => {
  try {
    const voteRes = await voteModel.findOne({
      user: req.body.userId,
      post: req.params.id,
    });

    const postObj = await postModel.findById(req.params.id);

    const voteValue =
      voteRes.type === "upvote" ? 1 : voteRes.type === "downvote" ? -1 : 0;
    // delete vote
    const deletedVote = await voteModel.findByIdAndDelete(voteRes._id);

    postObj.votes -= voteValue;
    const updatedPost = await postObj.save();

    return res.status(200).json({
      message: "vote deleted and post updated",
      updatedPost: updatedPost,
      deletedVote: deletedVote,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting vote" });
  }
};

const GET_ALL_VOTES = async (req, res) => {
  try {
    const votes = await voteModel.find();

    return res.status(200).json({ message: "success", votes: votes });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

export { CREATE_VOTE, UPDATE_VOTE, DELETE_VOTE_BY_POST_ID, GET_ALL_VOTES };
