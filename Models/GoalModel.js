// goalModel.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
            project: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Project',
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            desc: {
                type: String,
            },
            dueDate: {
                type: Date,
                required: true,
            },
            comments: [{
                user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                },
                text: String,
            }],
            status: {
                type: String,
                enum: ['todo', 'inprogress', 'done'],
            },
            isCompleted: {
                type: Boolean,
                default: false,
            },
            }, {
            timestamps: true,
});


const GoalModel = mongoose.model("Goal", goalSchema);

module.exports = {
    GoalModel,
};