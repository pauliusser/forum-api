import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

const generateHashedPass = (pass) => {
  const salt = bcrypt.genSaltSync(10);
  // console.log(salt);
  const hashedPassword = bcrypt.hashSync(pass, salt);
  return hashedPassword;
};

const REGISTER = async (req, res) => {
  try {
    // if (!req.body.email.includes("@")) {
    //   return res.status(400).json({ message: "validation error" });
    // }

    // if (req.body.name.length > 0) {
    //   // cia padaroma kad vardas butu didziaja raide
    //   const name = req.body.name;
    //   req.body.name = name.charAt(0).toUpperCase() + name.slice(1);
    // }

    // // jei neturi skaitmenu        arba    jei trumpesnis uz 6 simbolius
    // if (!/\d/.test(req.body.password) || req.body.password.length < 6) {
    //   return res.status(400).json({ message: "validation error" });
    // }

    //patikrinti ar vardas arba emailas neuzimtas
    const nameTaken = await userModel.exists({ name: req.body.name });
    const emailTaken = await userModel.exists({ name: req.body.email });
    if (nameTaken || emailTaken) {
      return res.status(400).json({ message: "name or email already exist" });
    }

    const u = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: generateHashedPass(req.body.password),
      profile_picture: req.body.profile_picture,
    });

    const user = await u.save();
    // console.log(id);

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    return res.status(200).json({ message: "registration succesfull", jwt_token: token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

export { REGISTER };
