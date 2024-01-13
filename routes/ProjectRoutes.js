const express = require('express');
const Projectrouter = express.Router();
const {ProjectModel} = require('../Models/ProjectModel');
const {authenticate} = require('../Middelwares/authenticate');
const {SprintModel}=require('../Models/SprintModel')
const {TaskModel}=require('../Models/TaskModel')
const moment = require("moment");




Projectrouter.get('/', authenticate, async (req, res) => {
  try {
    const projects = await ProjectModel.find({ client: req.userId }).populate('milestones');
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

Projectrouter.get("/projectsByUser/:userId", async (req, res) => {
  try {
      const { userId } = req.params;
      const projects = await ProjectModel.find({ client: userId }).populate('client').populate('sprints').populate({
        path: 'sprints',
        populate: {
          path: 'tasks',
          model: 'Task' // Replace 'Task' with the actual model name for tasks
        }
      }).exec();;
      res.json(projects);
  } catch (error) {
      console.error('Error fetching projects:', error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
})



Projectrouter.get('/projects', async (req, res) => {
  try {
    const projects = await ProjectModel.find().populate('client');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ 'err': error });
  }
});



Projectrouter.post("/createProject", async (req, res) => {
  try {
    console.log('created',req.body)
      const { title, client } = req.body;
      // const user = new UserModel({email,password:hash,name,brandName})
        // await user.save()
      const newProject = new ProjectModel({ title, client});
      await newProject.save()
      res.send({"msg":"project saved"});
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});



Projectrouter.post("/addSprint/:projectId", async (req, res) => {
  try {
      const { title, goal, timeline, startDate, endDate } = req.body;
      console.log(req.body)
      const { projectId } = req.params;
      const newSprint = await SprintModel.create({
          title,
          goal,
          timeline,
          startDate,
          endDate,
      });
      const project = await ProjectModel.findByIdAndUpdate(
          projectId,
          { $push: { sprints: newSprint._id } },
          { new: true }
      );
      res.json(project);
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});


// Route to add a new task to a specific sprint
Projectrouter.post("/addTask/:sprintId", async (req, res) => {
  try {
      const { title, status, priority, type, role, githubLink, description, taskDate } = req.body;
      const { sprintId } = req.params;
        // console.log(sprintId,req.body)
      const newTask = await TaskModel.create({
          title,
          status,
          priority,
          type,
          role,
          githubLink,
          description,
          taskDate,
      });
      // const sprints =await SprintModel.findById(sprintId)
      const sprint = await SprintModel.findByIdAndUpdate(
          sprintId,
          { $push: { tasks: newTask._id } },
          { new: true }
      );
      res.json(sprint);
      // console.log(sprint)
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});

const getTaskStatusSummary = async () => {
 
};

Projectrouter.get('/taskStatusSummary', async (req, res) => {
  // try {
    const sevenDaysAgo = moment().subtract(7, 'days').toDate();

    try {
      const result = await TaskModel.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);
     res.json(result)
    } catch (error) {
      console.error('Error aggregating tasks:', error.message);
      // throw error;
    }
  //   const summary = await getTaskStatusSummary();
  //   console.log(summary)
  //   res.json(summary);
  // } catch (error) {
  //   res.status(500).json({ error: 'Internal Server Error' });
  // }
})

module.exports = 
{
  Projectrouter
}