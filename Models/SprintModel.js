const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema({
    title: String,
    goal: String,
    timeline: String,
    status: {
        active: {
            type: Boolean,
            default: false,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    startDate: Date,
    endDate: Date,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const SprintModel = mongoose.model("Sprint", sprintSchema);

module.exports = {
    SprintModel,
};
