import topicModel from "../models/topic.js";

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
    const topics = await topicModel.find();

    return res.status(200).json({ message: "success", topics: topics });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

export { CREATE_TOPIC, GET_ALL_TOPICS };
