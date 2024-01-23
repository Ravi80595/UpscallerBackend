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



Projectrouter.get("/projectsUser",authenticate, async (req, res) => {
      const userId = req.body.userID
      console.log(userId,'id')
  try {
      // const { userId } = req.params;
      const projects = await ProjectModel.find({ client: userId }).populate('client').populate('sprints').populate({
        path: 'sprints',
        populate: {
          path: 'tasks',
          model: 'Task', // Replace 'Task' with the actual model name for tasks
          populate: {
            path: 'assignedTo',
            model: 'Team' // Replace 'TeamMember' with the actual model name for team members
          }
        }
      }).exec();
      res.json(projects);
  } catch (error) {
      console.error('Error fetching projects:', error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
})

Projectrouter.get("/projectsByUser/:userId", async (req, res) => {
  try {
      const { userId } = req.params;
      const projects = await ProjectModel.find({ client: userId }).populate('client').populate('sprints').populate({
        path: 'sprints',
        populate: {
          path: 'tasks',
          model: 'Task', // Replace 'Task' with the actual model name for tasks
          populate: {
            path: 'assignedTo',
            model: 'teams' // Replace 'TeamMember' with the actual model name for team members
          }
        }
      }).exec();
      res.json(projects);
  } catch (error) {
      console.error('Error fetching projects:', error.message);
      res.status(500).json({ error: "Internal Server Error" });
  }
})



Projectrouter.get('/projects', async (req, res) => {
  try {
    const projects = await ProjectModel.find().populate('client').populate('sprints').populate({
      path: 'sprints',
      populate: {
        path: 'task',
        model: 'Task',
        populate: {
          path: 'assignedTo',
          model: 'Teams' // Replace 'TeamMember' with the actual model name for team members
        }
      }
    }).exec();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ 'err': error });
  }
});



Projectrouter.post("/createProject", async (req, res) => {
  try {
    // console.log('created',req.body)
      const { title, client,github,repoName,projectTeam,projectDesc,projectDetailsDesc} = req.body;
      // const user = new UserModel({email,password:hash,name,brandName})
        // await user.save()
      const newProject = new ProjectModel({ title, client,github,repoName,projectTeam,projectDesc,projectDetailsDesc});
      await newProject.save()
      res.send({"msg":"project saved"});
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});



Projectrouter.post("/addSprint/:projectId", async (req, res) => {
  try {
      const { title, goal, timeline, startDate, endDate } = req.body;
      // console.log(req.body)
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


Projectrouter.post("/addTask/:sprintId", async (req, res) => {
  try {
      const { title, status, priority, type, role, githubLink, description, taskDate,assignedTo } = req.body;
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
          assignedTo
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


Projectrouter.put('/updateSprintStatus/:sprintId', async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { active } = req.body;
    if (!sprintId || active === undefined) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const updatedSprint = await SprintModel.findByIdAndUpdate(
      sprintId,
      { $set: { 'status.active': active } },
      { new: true }
    );

    if (!updatedSprint) {
      return res.status(404).json({ error: 'Sprint not found' });
    }

    res.json(updatedSprint);
  } catch (error) {
    console.error('Error updating sprint status:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


Projectrouter.put('/updateTaskStatus/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { $set: { status } },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task status:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

Projectrouter.put('/updateTaskPriority/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { priority } = req.body;
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      { $set: { priority } },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task priority:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = 
{
  Projectrouter
}