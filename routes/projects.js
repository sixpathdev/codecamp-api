const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Project = require("../models/Project");

router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.body.createdby);
    if (user) {
      const projects = await Project.find({ createdby: req.body.createdby });
      return res.status(200).json({ status: res.statusCode, data: projects });
    } else {
      return res
        .status(400)
        .json({ status: res.statusCode, message: "Invalid user." });
    }
  } catch (err) {
    return res.json({ message: "Error fetching projects" });
  }
});

router.post("/new", async (req, res) => {
  const project = new Project({ ...req.body });
  try {
    const newProject = await project.save();
    return res.status(201).json({ status: res.statusCode, data: newProject });
  } catch (err) {
    return res.status(200).json({ status: res.statusCode, message: err });
  }
});

router.get("/ongoing", async (req, res) => {
  try {
    const user = await User.findById(req.body.createdby);
    if (user) {
      const projects = await Project.find({ createdby: req.body.createdby });
      return res.status(200).json({ status: res.statusCode, data: projects });
    } else {
      return res
        .status(400)
        .json({ status: res.statusCode, message: "Invalid user." });
    }
  } catch (err) {
    return res.json({ message: "Error fetching projects" });
  }
});

module.exports = router;
