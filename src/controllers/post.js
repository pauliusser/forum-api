import postModel from "../models/post.js";
import topicModel from "../models/topic.js";
import voteModel from "../models/vote.js";
import mongoose from "mongoose";

const CREATE_POST = async (req, res) => {
  try {
    const { content, userId, topicId } = req.body;

    const post = new postModel({
      content: content,
      author: userId,
      topic: topicId,
    });

    await post.save();

    // Check if it's the first post to the topic
    const topic = await topicModel.findById(topicId);
    if (!topic.initialPost) {
      // Update the topic data to include reference to this post id
      topic.initialPost = post._id;
      await topic.save();
    }

    return res.status(200).json({
      message: "post created",
      post: post,
      status: req.body.status,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

const GET_ALL_POSTS_BY_TOPIC_ID = async (req, res) => {
  const topicId = req.params.id;
  const userId = req.body.userId;

  try {
    const postsWithTopicAndVote = await postModel.aggregate([
      {
        $match: { topic: mongoose.Types.ObjectId.createFromHexString(topicId) }, // Match posts with the specified topicId
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $lookup: {
          from: "votes",
          let: {
            postId: "$_id",
            userId: mongoose.Types.ObjectId.createFromHexString(userId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$post", "$$postId"] }, { $eq: ["$user", "$$userId"] }],
                },
              },
            },
          ],
          as: "userVote",
        },
      },
      {
        $addFields: {
          authorName: { $arrayElemAt: ["$authorDetails.name", 0] },
          authorProfilePicture: { $arrayElemAt: ["$authorDetails.profile_picture", 0] },
          userVote: { $arrayElemAt: ["$userVote.type", 0] },
          isAuthor: {
            $eq: ["$author", mongoose.Types.ObjectId.createFromHexString(userId)],
          }, // Add a boolean field to indicate if the userId matches the author
        },
      },
      {
        $project: {
          "authorDetails.password": 0, // Remove authorDetails field
        },
      },
    ]);

    res.json({ posts: postsWithTopicAndVote, status: req.body.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DELETE_POST_BY_ID = async (req, res) => {
  try {
    //surasti user
    const userId = req.body.userId;
    //surasti author
    const postObj = await postModel.findById(req.params.id);
    const authorId = postObj.author;
    //palyginti user ir author ir ar ne adminas
    if (userId != authorId && req.body.status != "admin") {
      return res.status(404).json({ message: "error" });
    }

    const post = await postModel.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    //surasti su postu asocijuotus balsus ir juos istrinti
    const voteResponse = await voteModel.deleteMany({ post: req.params.id });

    // Check if the topic associated with the post has any other posts left
    const remainingPostsCount = await postModel.countDocuments({ topic: post.topic });
    if (remainingPostsCount === 0) {
      // If no remaining posts, delete the topic as well
      const topic = await topicModel.findByIdAndDelete(post.topic);
      return res.status(200).json({
        message: "topic empty, deleted post, topic and votes",
        topic: topic,
        post: post,
        votes: voteResponse,
        status: req.body.status,
      });
    }

    return res
      .status(200)
      .json({ message: "Post deleted", post: post, status: req.body.status });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error", error: err });
  }
};

const GET_ALL_POSTS_BY_USER_ID = async (req, res) => {
  try {
    const response = await postModel.find({
      author: req.body.userId,
    });
    return res
      .status(200)
      .json({ message: "Post deleted", posts: response, status: req.body.status });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error", error: err });
  }
};

export {
  CREATE_POST,
  GET_ALL_POSTS_BY_TOPIC_ID,
  DELETE_POST_BY_ID,
  GET_ALL_POSTS_BY_USER_ID,
};
