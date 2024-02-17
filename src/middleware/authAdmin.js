import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "not authenticated" });
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "not authenticated" });
      }
      if (decoded.status != "admin") {
        return res.status(401).json({ message: "not authenticated" });
      }
      req.body.status = decoded.status;
      // console.log(decoded);
      console.log("admin authenticated", req.body);
      return next();
    });
  } catch (err) {
    console.log(err);
  }
};

export default authAdmin;
