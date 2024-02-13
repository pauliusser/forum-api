import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "not authenticated" });
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "not authenticated" });
      }
      req.body.userId = decoded.id;
      // console.log(decoded);
      console.log("user authenticated", req.body);
      return next();
    });
  } catch (err) {
    console.log(err);
  }
};

export default authUser;
