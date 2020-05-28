const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth")

const Project = require("../models/Project");
const ProjectStatus = require("../models/ProjectStatus");
const AttachedUser = require("../models/AttachedUser");

//List out all your created projects
router.get("/", auth, async (req, res) => {
  try {
      const projects = await Project.find({ createdby: req.userId });
      if(projects.length > 0) {
        return res.status(200).json({ status: res.statusCode, data: projects });
      } else {
      return res.status(200).json({ status: res.statusCode, message: "No project available" });
    }
  } catch (err) {
    return res.status(401).json({status: res.statusCode, message: "An error occured" });
  }
});

//Create a new project
router.post("/new", auth, async (req, res) => {
  const project = new Project({ ...req.body, createdby: req.token.userId });
  try {
    const newProject = await project.save();
    return res.status(201).json({ status: res.statusCode, data: newProject });
  } catch (err) {
    return res.status(200).json({ status: res.statusCode, message: err });
  }
});

//Activate a project as ongoing
router.post("/activate", auth, async (req, res) => {
  const projectExists = await Project.find({_id: req.body.project, createdby: req.token.userId});
  if(projectExists.length > 0) {
    const project = new ProjectStatus({ ...req.body, createdby: req.token.userId });
  try {
    const newProject = await project.save();
    return res.status(201).json({ status: res.statusCode, data: newProject });
  } catch (err) {
    return res.status(200).json({ status: res.statusCode, message: err });
  }
  } else {
    return res.status(404).json({ status: res.statusCode});
  }
});

//Attach a user to a project
router.post("/:project/user/attach", auth, async (req, res) => {
  const projectExists = await Project.find({_id: req.params.project})
  const checkProjectStatus = await ProjectStatus.find({project: req.params.project})
  const isAttachedUser = await AttachedUser.find({user: req.body.user, project: req.params.project})
  try{
    if(projectExists.length < 1) {
      return res.status(404).json({status: res.statusCode, message: "Project not found"})
    } else if(isAttachedUser.length > 0) {
      return res.status(200).json({status: res.statusCode, message: "You already have access to this project"})
    } else if(checkProjectStatus.length < 1) {
      return res.status(404).json({status: res.statusCode, message: "This project is not ongoing yet"})
    }
    const attachUser = new AttachedUser({
      project: req.params.project,
      user: req.body.user
    })
    const attachedUser = await attachUser.save()
    return res.status(201).json({status: res.statusCode, message: "User added to project successfully", data: attachedUser})
  } catch(err){
    return res.status(200).json({status: res.statusCode, message: err})
  }
})

//Returns ongoing projects
router.get("/ongoing", auth, async (req, res) => {
  const ongoingProjects = await ProjectStatus.find({ createdby: req.token.userId, ongoing: true });
  try {
    if (ongoingProjects.length < 1) {
      return res.status(404).json({ status: res.statusCode, message: "No ongoing projects found for user" });
    } else {
      return res.status(200).json({ status: res.statusCode, data: ongoingProjects });
    }
  } catch(err) {
    return res.status(500).json({ status: res.statusCode, message: "An error occured while getting ongoing projects" });
  }
});

//update ongoing projects status
router.put("/ongoing", auth, async (req, res) => {
  console.log(req.token)
  try {
    const ongoingProjects = await ProjectStatus.updateOne({ _id: req.body.id, createdby: req.token.userId }, { completed: true, ongoing: false }, (err, resp) => {
      if(err) {
        return res.status(200).json({ status: res.statusCode, message: err });
      } else {
        ProjectStatus.findOne({ _id: req.body.id, createdby: req.token.userId }, (err, data)=>{
          if(err){
            return res.status(200).json({ status: res.statusCode, message: "Error retrieving updated data" });
          } else {
            return res.status(200).json({ status: res.statusCode, message: "Project status updated successfully", data });
          }
        })
      }
    });
  } catch(err) {
    return res.status(200).json({ status: res.statusCode, message: err });
  }
});


module.exports = router;
