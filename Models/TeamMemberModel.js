const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
      },
      address: {
        type: String,
      },
      joiningDate: {
        type: Date,
      },
      about:{
        type:String,
      }
    });

const TeamMemberModel = mongoose.model("Team", teamMemberSchema);

module.exports = {
  TeamMemberModel,
};
