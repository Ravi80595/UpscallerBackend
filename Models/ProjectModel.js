const mongoose = require("mongoose");
const { GetCurrentDate, GetCurrentTime } = require("../utils/DateAndTime");

const GetCurrent1Date = GetCurrentDate();
const GetCurrent1Time = GetCurrentTime();

const projectSchema = mongoose.Schema({
    title: String,
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    projectDesc:String,
    projectDetailsDesc:String,
    github:String,
    repoName:String,
    // projectTeam:[{type:mongoose.Schema.Types.ObjectId, ref: 'Team'}],
    projectTeam: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    sprints: [{type:mongoose.Schema.Types.ObjectId, ref: 'Sprint' }],
    NoteDate: { type: String, default: GetCurrent1Date },
    NoteTime: { type: String, default: GetCurrent1Time },
});

const ProjectModel = mongoose.model("Project", projectSchema);

module.exports = {
    ProjectModel,
};
