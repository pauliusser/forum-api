import postModel from "../models/post.js";

const CREATE_POST = async (req, res) => {
  try {
    const post = new postModel({
      content: req.body.content,
      author: req.body.userId,
      topic: req.body.topicId,
    });

    await post.save();

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
