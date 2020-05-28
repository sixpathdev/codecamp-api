const express = require("express");
const moment = require("moment");
const router = express.Router();

const auth = require("../middlewares/auth")

const Project = require("../models/Project");
const Task = require("../models/Task");
const AttachedUser = require("../models/AttachedUser");

//Get all user tasks
router.get("/", auth, async (req, res) => {
  try {
    const userTasks = await Task.find({createdby: req.token.userId})
    if(userTasks.length < 1) {
      return res.status(404).json({status: res.statusCode, message: "No task available"})
    } else {
      return res.status(200).json({ status: res.statusCode, data: userTasks });
    }
  } catch (err) {
    return res.status(200).json({ status: res.statusCode, message: "Error fetching tasks" });
  }
});

//Create a new task under a project
router.post("/:projectId/new", auth, async (req, res) => {
      const projectExists = await Project.find({_id: req.params.projectId})
      const isAttachedUser = await AttachedUser.find({user: req.token.userId, project: req.params.projectId})
      try {
        if(isAttachedUser.length < 1) {
          return res.status(404).json({status: res.statusCode, message: "You have no access to this project"})
        } else {
          const task = new Task({
        taskname: req.body.taskname,
        timeframe: req.body.timeframe,
        project: req.params.projectId,
        createdby: req.token.userId
      })
      if(projectExists.length > 0){
          const createdTask = await task.save()
            return res.status(201).json({status: res.statusCode, message: "A new task added to project", data: createdTask})
          }
        }
      } catch(err) {
        return res.status(200).json({status: res.statusCode, message: err})
      }
  });

  //Get all ongoing tasks
router.get("/ongoing", auth, async (req, res) => {
  const ongoingTasks = await Task.find({ createdby: req.token.userId, ongoing: true });
  try {
    if (ongoingTasks.length < 1) {
      return res.status(404).json({ status: res.statusCode, message: "No ongoing task" });
    } else {
      return res.status(200).json({ status: res.statusCode, data: ongoingTasks });
    }
  } catch(err) {
    return res.status(500).json({ status: res.statusCode, message: err });
  }
});

//start an ongoing task
router.put("/activate", auth, async (req, res) => {
  const ongoingTasks = await Task.updateOne({ _id: req.body.task, createdby: req.token.userId, ongoing: false }, {ongoing: true}, (err, data) => {
    if(err) {
      return res.status(200).json({ status: res.statusCode, message: err });
    } else {
      Task.findOne({ _id: req.body.task, createdby: req.token.userId }, (err, data)=>{
        if(err){
          return res.status(200).json({ status: res.statusCode, message: "Error retrieving updated data" });
        } else {
          return res.status(200).json({ status: res.statusCode, message: "Task updated successfully", data });
        }
      })
    }
  });
  // try {
  //   if (ongoingTasks.length < 1) {
  //     return res.status(404).json({ status: res.statusCode, message: "No ongoing task" });
  //   } else {

  //     return res.status(200).json({ status: res.statusCode, data: ongoingTasks });
  //   }
  // } catch(err) {
  //   return res.status(500).json({ status: res.statusCode, message: err });
  // }
});

//mark task completed
router.put("/completed", auth, async (req, res) => {
  const ongoingTasks = await Task.updateOne({ _id: req.body.task, createdby: req.token.userId, ongoing: true }, {ongoing: false, completed: true}, (err, data) => {
    if(err) {
      return res.status(200).json({ status: res.statusCode, message: err });
    } else {
      Task.findOne({ _id: req.body.task, createdby: req.token.userId }, (err, data)=>{
        if(err){
          return res.status(200).json({ status: res.statusCode, message: "Error retrieving updated data" });
        } else {
          return res.status(200).json({ status: res.statusCode, message: "Task marked as completed", data });
        }
      })
    }
  })
})

//Get all completed tasks
router.get("/completed", auth, async (req, res) => {
  const completedTasks = await Task.find({ createdby: req.token.userId, completed: true });
  try {
    if (completedTasks < 1) {
      return res.status(404).json({ status: res.statusCode, message: "No completed tasks found" });
    } else {
      return res.status(200).json({ status: res.statusCode, data: completedTasks });
    }
  } catch(err) {
    return res.status(500).json({ status: res.statusCode, message: err });
  }
});

module.exports = router;
