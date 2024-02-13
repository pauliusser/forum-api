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

// const CREATE_VOTE = async (req, res) => {
//   try {
//     const { userId, post: postId, type } = req.body;

//     // Find the post by its ID
//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     // Determine the vote value based on the type
//     let voteValue = 0;
//     if (type === "upvote") {
//       voteValue = 1;
//     } else if (type === "downvote") {
//       voteValue = -1;
//     } else {
//       return res.status(400).json({ message: "Invalid vote type" });
//     }

//     // Update the votes field of the post
//     post.votes += voteValue;

//     // Save the updated post
//     const updatedPost = await post.save();

//     console.log("create vote");
//     return res.status(200).json({ message: "vote_created", post: updatedPost });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "error" });
//   }
// };

const UPDATE_VOTE = async (req, res) => {
  try {
    console.log("update vote endpoint not finished");
    return res.status(200).json({ message: "vote updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

const DELETE_VOTE_BY_POST_ID = async (req, res) => {
  try {
    const response = await voteModel.findOneAndDelete({
      post: req.params.id,
      user: req.body.userId,
    });
    if (!response) {
      return res.status(404).json({ message: "Vote not found" });
    }
    return res.status(200).json({ message: "vote deleted", vote: response });
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
