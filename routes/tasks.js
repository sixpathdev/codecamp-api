const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  try {
      const user = await Task.find({project: req.body.project, createdby: req.body.userId})
      const project = await Project.findById(req.body.project)
      if(user.length > 0 && project.length > 0) {
        const tasks = await Task.find({createdby: req.body.userId}).populate("project", "title description completed createdby createdon");
        return res.status(200).json({ status: res.statusCode, data: tasks });
      } else {
        return res.status(400).json({status: res.statusCode, message: "Task not found."})
    }
  } catch (err) {
    return res.status(500).json({ status: res.statusCode, message: "Error fetching tasks" });
  }
});

router.post("/new", async (req, res) => {
    const task = new Task({...req.body})
    try {
        const newTask = await task.save();
        return res.status(201).json({status: res.statusCode, data: newTask})
    } catch(err) {
        return res.status(200).json({status: res.statusCode, message: err})
    }
  });

router.get("/ongoing", async (req, res) => {
  const ongoingTasks = await Task.find({ user: req.body.userId, completed: false, ongoing: true });
  try {
    if (!ongoingTasks || ongoingTasks.length < 1) {
      return res.status(404).json({ status: res.statusCode, message: "No ongoing task" });
    } else {
      return res.status(200).json({ status: res.statusCode, data: ongoingTasks });
    }
  } catch(err) {
    return res.status(500).json({ status: res.statusCode, message: err });
  }
});

router.get("/completed", async (req, res) => {
  const completedTasks = await Task.find({ user: req.body.userId, ongoing: false, completed: true });
  try {
    if (!completedTasks || completedTasks < 1) {
      return res.status(404).json({ status: res.statusCode, message: "No completed tasks found" });
    } else {
      // {...user._doc, password: null}
      return res.status(200).json({ status: res.statusCode, data: completedTasks });
    }
  } catch(err) {
    return res.status(500).json({ status: res.statusCode, message: err });
  }
});

module.exports = router;
