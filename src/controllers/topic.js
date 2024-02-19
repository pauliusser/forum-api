import topicModel from "../models/topic.js";
import postModel from "../models/post.js";
import voteModel from "../models/vote.js";
import mongoose from "mongoose";

const CREATE_TOPIC = async (req, res) => {
  try {
    const topic = new topicModel({
      title: req.body.title,
      creator: req.body.userId,
    });

    await topic.save();

    return res.status(200).json({
      message: "topic created",
      topic: topic,
      status: req.body.status,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

const GET_ALL_TOPICS = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId.createFromHexString(req.body.userId);

    const topics = await topicModel.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "initialPost",
          foreignField: "_id",
          as: "initialPostDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creatorDetails",
        },
      },
      {
        $addFields: {
          isCreator: { $eq: ["$creator", userId] },
        },
      },
      {
        $project: {
          "creatorDetails.password": 0, // Exclude sensitive fields if necessary
        },
      },
    ]);

    return res
      .status(200)
      .json({ message: "success", topics: topics, status: req.body.status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error" });
  }
};

const GET_TOPIC_BY_ID = async (req, res) => {
  try {
    const topic = await topicModel.findOne({ _id: req.params.id });

    return res
      .status(200)
      .json({ message: "success", topic: topic, status: req.body.status });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

const DELETE_TOPIC_BY_ID = async (req, res) => {
  try {
    const userId = req.body.userId;
    const topicObj = await topicModel.findById(req.params.id);

    if (topicObj.creator != userId && req.body.status != "admin") {
      return res.status(400).json({ message: "error" });
    }
    const topic = await topicModel.findByIdAndDelete(req.params.id);
    const postsData = await postModel.find({ topic: req.params.id });
    const posts = await postModel.deleteMany({ topic: req.params.id });
    const postIds = postsData.map((post) => post._id);

    // Delete votes associated with the deleted posts
    const votes = await voteModel.deleteMany({ post: { $in: postIds } });
    return res.status(200).json({
      message: "topic deleted",
      topic_deleted: topic,
      posts_deleted: posts,
      votes_deleted: votes,
      status: req.body.status,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

export { CREATE_TOPIC, GET_ALL_TOPICS, DELETE_TOPIC_BY_ID, GET_TOPIC_BY_ID };
