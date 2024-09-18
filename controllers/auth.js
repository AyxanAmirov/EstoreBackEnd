const Auth = require("../models/auth");
const is = require("is_js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
//register
const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  try {
    // Email yoxlaması
    if (!email) {
      return res.status(400).json({ message: "Email field must be filled" });
    }
    if (is.not.email(email)) {
      return res.status(400).json({ message: "Email must be in email format" });
    }

    // Email mövcudluğu yoxlaması
    const user = await Auth.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // İstifadəçi adı yoxlaması
    if (!username) {
      return res.status(400).json({ message: "Username field must be filled" });
    }

    // Parol yoxlaması
    if (!password) {
      return res.status(400).json({ message: "Password field must be filled" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password must be at least 5 characters long" });
    }

    // Parol təsdiqi yoxlaması
    if (!confirmPassword) {
      return res
        .status(400)
        .json({ message: "Confirm password field must be filled" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Parolun hash edilməsi
    const hashedPass = await bcrypt.hash(password, 8);

    // Yeni istifadəçinin yaradılması
    const newUser = await Auth.create({
      username,
      email,
      password: hashedPass,
    });
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({
      status: "user created",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
    await newUser.save();
    //mail confirm

    // const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.USER_EMAIL,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });
    // const mailOptions = {
    //   from: process.env.USER_EMAIL,
    //   to: newUser.email,
    //   subject: "Email Confirmation",
    //   html: `<p>Please confirm your email by clicking on the following link:</p>
    //            <a href="${process.env.CLIENT_URL}/confirm-email?token=${token}">Confirm Email</a>`,
    // };
    // await transporter.sendMail(mailOptions);
    // res.status(201).json({ message: "User registered, please verify your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email field must be filled" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password field must be filled" });
    }
    const user = Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const comparePassword = bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ message: "User is not find " });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    res.status(200).json({ status: "sucsess", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { register, login };
