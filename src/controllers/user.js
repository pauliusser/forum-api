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
    // if (req.body.name.length > 0) {
    //   // cia padaroma kad vardas butu didziaja raide
    //   const name = req.body.name;
    //   req.body.name = name.charAt(0).toUpperCase() + name.slice(1);
    // }

    // // jei neturi skaitmenu        arba    jei trumpesnis uz 6 simbolius
    // if (!/\d/.test(req.body.password) || req.body.password.length < 6) {
    //   return res.status(400).json({ message: "validation error" });
    // }

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

    // const user =
    await u.save();

    // const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_KEY, {
    //   expiresIn: "2h",
    // });

    return res.status(200).json({
      message: "registration succesfull",
      // jwt_token: token
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

const LOGIN = async (req, res) => {
  try {
    // pagal vartotojo siunciama emaila randamas vartotojas
    const user = await userModel.findOne({ email: req.body.email });
    // console.log(user);
    // jei objekto neranda:
    if (!user) {
      console.log("bad email");
      return res.status(404).json({ message: "bad email or password" });
    }
    console.log("email ok");
    // patikrinama ar siunčiamas slaptažodis sutampa
    const isPassMatch = bcrypt.compareSync(req.body.password, user.password);
    // jei slaptažodžiai nesutampa
    if (!isPassMatch) {
      console.log("bad pass");
      return res.status(404).json({ message: "bad email or password" });
    }
    console.log("pass ok");
    //---jei autentikacija gera---
    //sugeneruojamas 2 val tokenas
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    //siunčiama sekmes žinutė su tokenu
    return res.status(200).json({
      message: "login successful",
      jwt_token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error" });
  }
};

const VALIDATE = (req, res) => {
  return res.status(200).json({
    message: "user authenticated",
  });
};

export { REGISTER, LOGIN, VALIDATE };
