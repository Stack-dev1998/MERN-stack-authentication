const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModal = require("../modals/user.modal");
const createLink = require("../utils/createLink");
const {
  transporter,
  verifyEmailTemplate,
  resetPasswordEmailTemplate,
} = require("../utils/email");
const router = express.Router();

//====================================================== Signup ============================
router.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      throw new Error("Passwords not matched!");
    }
    if (await userModal.findOne({ email:email.toLowerCase() })) {
      throw new Error(email + '" already in use!');
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new userModal({
      name,
      email:email.toLowerCase(),
      password: hashedPassword,
    });
    await newUser.save();
    const link = createLink(newUser, "http://localhost:5000/user/verify-email");
    let message = {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: "Subject",
      html: verifyEmailTemplate(link),
    };
    transporter.sendMail(message, function (err, info) {
      if (err) throw err;
      res.json({
        message: "Email has been sent. Please check your email inbox!",
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//====================================================== Verify email ============================
router.get("/verify-email/:id/:token", (req, res) => {
  const { id, token } = req.params;
  try {
    userModal.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isEmailVerified: true,
      },
      (err, doc) => {
        if (err) throw error;
        res.send("<h1>Email Verified Successfully!</h1>");
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//====================================================== Login ====================================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModal.findOne({ email:email.toLowerCase() });
    if (!user) throw new Error("Incorrect email or passwords");
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error("Incorrect email or passwords");
    }
    if (!user.isEmailVerified) {
      throw new Error("Please verify your email!");
    }

    const token = jwt.sign(
      { userID: user.id, email: user.email },
      process.env.secret,
      {
        expiresIn: "7d",
      }
    );

    res.json({ message: "Login successfully!", token });
  } catch (error) {
    res.status(400).json({ message: error.message, token: null });
  }
});

//====================================================== Forgot password ============================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModal.findOne({ email:email.toLowerCase() });
    if (!user) throw new Error("User not found!");
    const link = createLink(user, "http://localhost:5000/user/reset-password");
    let message = {
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: "Subject",
      html: resetPasswordEmailTemplate(link),
    };
    transporter.sendMail(message, function (err, info) {
      if (err) throw err;
      res.json({
        message: "Reset link is sent to your email address successfully!",
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//====================================================== reset password ============================
router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  try {
    const user = await userModal.findOne({ _id: id });
    if (!user && !user.id === id) throw new Error("Invalid ID!");
    const secret = process.env.secret + user.password;
    jwt.verify(token, secret);
    res.render("reset-password", { error: "" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    const user = await userModal.findOne({ _id: id });
    if (!user && !user.id === id) throw new Error("Invalid ID!");
    if (password !== confirmPassword) throw new Error("Password not matched!");
    const secret = process.env.secret + user.password;
    jwt.verify(token, secret);
    const hashedPassword = bcrypt.hashSync(password, 10);
    await userModal.findOneAndUpdate(
      {
        _id: id,
      },
      {
        password: hashedPassword,
      }
    );
    res.send(
      "<h1 style='color:green; text-align:center; margin-top:100px;'>Password reset successfully!</h1>"
    );
  } catch (error) {
    res.render("reset-password", { error: error.message });
  }
});

router.post("/forgot-password", (req, res) => {
  res.json("user forgot password page");
});

//======================================================  Dashboard ============================
router.get("/dashboard", (req, res) => {
  res.json("user dashboard page");
});

module.exports = router;
