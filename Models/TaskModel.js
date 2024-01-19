const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' }], 
    status: {
        type: String,
        enum: ['todo', 'inprogress', 'done'],
        default: 'todo',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    type: String,
    role: String,
    githubLink: String,
    description: String,
    taskDate: Date,
    createdAt: { type: Date, default: Date.now },
});

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = {
    TaskModel,
};
