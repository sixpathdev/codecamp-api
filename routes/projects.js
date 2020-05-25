const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Project = require("../models/Project");
const ProjectStatus = require("../models/ProjectStatus");

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
  const ongoingProjects = await ProjectStatus.find({ user: req.body.userId, completed: false, ongoing: true });
  try {
    if (!ongoingProjects || ongoingProjects.length < 1) {
      return res.status(404).json({ status: res.statusCode, message: "No ongoing projects found for user" });
    } else {
      return res.status(200).json({ status: res.statusCode, data: ongoingProjects });
    }
  } catch(err) {
    return res.status(500).json({ status: res.statusCode, message: err });
  }
});

router.put("/ongoing", async (req, res) => {
  const ongoingProjects = await ProjectStatus.find({ user: req.body.userId, ongoing: true });
  try {
    if (ongoingProjects.length < 1) {
      return res.status(404).json({ status: res.statusCode, message: "No ongoing projects found for user" });
    } else {
      const updateProjectStatus = new ProjectStatus({
        completed: true,
        ongoing: false
      })
      const newlyUpdatedProjectStatus = await updateProjectStatus.save()
      return res.status(201).json({ status: res.statusCode, data: newlyUpdatedProjectStatus });
    }
  } catch(err) {
    return res.status(500).json({ status: res.statusCode, message: err });
  }
});

router.get("/completed", async (req, res) => {
  const completedProjects = await ProjectStatus.find({ user: req.body.userId, ongoing: false, completed: true });
  try {
    if (!completedProjects || completedProjects < 1) {
      return res.status(404).json({ status: res.statusCode, message: "No completed projects found for user" });
    } else {
      return res.status(200).json({ status: res.statusCode, data: completedProjects });
    }
  } catch(err) {
    return res.status(500).json({ status: res.statusCode, message: err });
  }
});

module.exports = router;
