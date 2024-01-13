// models/teamMember.js
const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: String,
  Role : String,
  });

const TeamMemberModel = mongoose.model("TeamMember", teamMemberSchema);

module.exports = {
  TeamMemberModel
};
