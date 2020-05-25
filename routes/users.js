const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const router = express.Router();

const User = require("../models/User");
const ProjectStatus = require("../models/ProjectStatus");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: res.statusCode, data: users });
  } catch (err) {
    res.json({ message: "Error fetching all users" });
  }
});

router.post("/signup", async (req, res) => {
  const userexists = await User.findOne({ email: req.body.email });
  if (userexists) {
    return res.status(409).json({
      status: res.statusCode,
      message: "Account already exists",
    });
  }
  if(req.body.phone == '' || req.body.gender == '') {
    return res.statusCode(400).json({status: res.statusCode, message: "All fields in the form are required."})
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      throw err;
    }
    bcrypt.hash(req.body.password, salt, async (err, hash) => {
      if (err) {
        throw err;
      }
      const user = new User({
        // firstName: req.body.firstName,
        // lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        phone: req.body.phone,
        gender: req.body.gender,
      });
      try {
        const savedUser = await user.save();
        res.status(201).json({
          status: res.statusCode,
          message: "Account created sucessfully"
        });
      } catch (err) {
        res.status(500).json({ status: res.statusCode, message: err });
      }
    });
  });
});

router.post("/auth", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ status: res.statusCode, message: "Authentication failed" });
  }
    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) {
        return res.status(400).json({ status: res.statusCode, message: "Incorrect email/password" });
    }
    const token = jwt.sign({
        email: user.email,
        userId: user._id
    }, "hashmysecret@", {
        expiresIn: "1h"
    })
    return res.status(200).json({ status: res.statusCode, data: {token: token} });
});

router.get("/profile", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ status: res.statusCode, message: "Authentication failed" });
  } else {
    return res.status(200).json({ status: res.statusCode, data: {...user._doc, password: null} });
  }

});

router.get("/myprojects", async (req, res) => {
  const myprojects = await ProjectStatus.find({ user: req.body.userId });
  try {
    if (!myprojects || myprojects.length < 1) {
      return res.status(404).json({ status: res.statusCode, message: "Projects not found for user" });
    } else {
      return res.status(200).json({ status: res.statusCode, data: myprojects });
    }
  } catch(err) {
    return res.status(500).json({ status: res.statusCode, message: err });
  }
});



module.exports = router;
