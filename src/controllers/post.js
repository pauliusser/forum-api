import postModel from "../models/post.js";
import topicModel from "../models/topic.js";

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

export { CREATE_POST };
