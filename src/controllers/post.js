import postModel from "../models/post.js";
import topicModel from "../models/topic.js";
// import voteModel from "../models/vote.js";

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
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};
const GET_ALL_POSTS_BY_TOPIC_ID = async (req, res) => {
  try {
    const posts = await postModel
      .find({ topic: req.params.id })
      .populate({
        path: "topic",
        select: "title",
      })
      .populate({
        path: "author",
        select: "name profile_picture",
      });

    return res.status(200).json({ message: "success", posts: posts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

const DELETE_POST_BY_ID = async (req, res) => {
  try {
    const post = await postModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ post_deleted: post });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "post deleted", post: "error" });
  }
};

export { CREATE_POST, GET_ALL_POSTS_BY_TOPIC_ID, DELETE_POST_BY_ID };
