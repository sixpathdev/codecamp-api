const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  try {
      const user = await User.findById(req.body.createdby)
      const project = await Project.findById(req.body.project)
      if(user && project) {
        const tasks = await Task.find({createdby: req.body.createdby}).populate("project", "title description completed createdby createdon");
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

module.exports = router;
