import topicModel from "../models/topic.js";
import postModel from "../models/post.js";

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
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};
const GET_ALL_TOPICS = async (req, res) => {
  try {
    const topics = await topicModel
      .find()
      .populate({
        path: "initialPost",
        options: { sort: { createdAt: 1 }, limit: 1 },
      })
      .populate("creator");

    return res.status(200).json({ message: "success", topics: topics });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};
const GET_TOPIC_BY_ID = async (req, res) => {
  try {
    const topic = await topicModel.find({ _id: req.params.id });

    return res.status(200).json({ message: "success", topic: topic });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

const DELETE_TOPIC_BY_ID = async (req, res) => {
  try {
    const topic = await topicModel.findByIdAndDelete(req.params.id);
    const posts = await postModel.deleteMany({ topic: req.params.id });
    return res.status(200).json({ topic_deleted: topic, posts_deleted: posts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

export { CREATE_TOPIC, GET_ALL_TOPICS, DELETE_TOPIC_BY_ID, GET_TOPIC_BY_ID };
