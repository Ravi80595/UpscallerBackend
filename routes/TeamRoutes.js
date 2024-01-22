const express = require("express")
const jwt = require("jsonwebtoken")
const TeamRouter = express.Router()
const {authenticate} = require("../Middelwares/authenticate");
const { TeamMemberModel } = require("../Models/TeamMemberModel");


TeamRouter.post("/create", async (req, res) => {
    try {
      const { name, role, email, phoneNumber, age, address, joiningDate,about } = req.body;
      const newTeamMember = new TeamMemberModel({
        name,
        role,
        email,
        phoneNumber,
        age,
        address,
        joiningDate,
        about
      });
      const savedTeamMember = await newTeamMember.save();
      res.status(201).json({ message: "Team member created successfully", teamMember: savedTeamMember });
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


// Get all team members
TeamRouter.get("/all", async (req, res) => {
    try {
      const allTeamMembers = await TeamMemberModel.find();
      res.status(200).json({ data: allTeamMembers });
    } catch (error) {
      console.error("Error getting all team members:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});


// Get profile of a specific team member
TeamRouter.get("/:id",async (req, res) => {
    try {
      const teamMember = await TeamMemberModel.findById(req.params.id);
      if (!teamMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      res.status(200).json({ teamMember });
    } catch (error) {
      console.error("Error getting team member profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // Edit a team member
TeamRouter.put("/edit/:id", async (req, res) => {
    try {
      // Find the team member by ID and update the fields
      const updatedTeamMember = await TeamMemberModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // Return the updated document
      );
      if (!updatedTeamMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      res.status(200).json({ message: "Team member updated successfully", teamMember: updatedTeamMember });
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // Delete a team member
TeamRouter.delete("/delete/:id", async (req, res) => {
    try {
      const deletedTeamMember = await TeamMemberModel.findByIdAndDelete(req.params.id);
      if (!deletedTeamMember) {
        return res.status(404).json({ error: "Team member not found" });
      }
      res.status(200).json({ message: "Team member deleted successfully", teamMember: deletedTeamMember });
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



module.exports={
    TeamRouter
}