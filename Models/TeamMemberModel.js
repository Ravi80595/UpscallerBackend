// models/teamMember.js
const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  name: String,
  // You can add more details about a team member here
});

const TeamMemberModel = mongoose.model("TeamMember", teamMemberSchema);

module.exports = {
  TeamMemberModel
};
