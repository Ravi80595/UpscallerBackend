const express = require("express");
const { GoalModel } = require("../Models/GoalModel");
const GoalRouter = express.Router();



GoalRouter.post('/create', async (req, res) => {
    try {
        const { project,title,desc,dueDate,responsibleMembers,attachments,status} = req.body;
        // console.log(req.body)
        const newGoal = new GoalModel({
            project,
            title,
            desc,
            dueDate,
            responsibleMembers,
            attachments,
            status
        });
        const savedGoal = await newGoal.save();
        res.status(201).json(savedGoal);
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


GoalRouter.get('/project/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        // Find all goals related to the specified project
        const goals = await GoalModel.find({ project: projectId });

        res.status(200).json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



GoalRouter.get('/project/:projectId/inprogress', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const inProgressGoals = await GoalModel.find({ project: projectId, status: 'todo' });
        res.status(200).json(inProgressGoals);
    } catch (error) {
        console.error('Error fetching In Progress goals:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add a comment to a specific goal
GoalRouter.post('/comment/:goalId', async (req, res) => {
    try {
        const { user, text } = req.body;
        const goalId = req.params.goalId;
        const goal = await GoalModel.findById(goalId);
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        goal.comments.push({ user, text });
        const updatedGoal = await goal.save();

        res.status(201).json(updatedGoal);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports={
  GoalRouter
}
