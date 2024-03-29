import express from "express";
import mongoose from "mongoose";
import userRouter from "./src/routes/user.js";
import topicRouter from "./src/routes/topic.js";
import postRouter from "./src/routes/post.js";
import voteRouter from "./src/routes/vote.js";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(topicRouter);
app.use(postRouter);
app.use(voteRouter);

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use((req, res) => {
  return res.status(404).json({ message: "endpoint error" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
