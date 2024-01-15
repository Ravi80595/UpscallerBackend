const express = require("express");
const { ContactModel } = require("../Models/ContactModel");
const ContactRouter = express.Router();



ContactRouter.post("/submit", async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const newContactForm = new ContactModel({
            name,
            email,
            phone,
            message,
        });
        const savedForm = await newContactForm.save();
        res.status(201).json({ success: true, message: "Form submitted successfully", data: savedForm });
    } catch (error) {
        console.error("Error submitting form:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


ContactRouter.get("/submissions", async (req, res) => {
    try {
        const allSubmissions = await ContactModel.find();
        res.status(200).json({ success: true, data: allSubmissions });
    } catch (error) {
        console.error("Error retrieving submissions:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Delete a submission by ID
ContactRouter.delete("/delete/:id", async (req, res) => {
    try {
        const submissionId = req.params.id;
        const existingSubmission = await ContactModel.findById(submissionId);
        if (!existingSubmission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }
        await ContactModel.deleteOne({ _id: submissionId });
        res.status(200).json({ success: true, message: "Submission deleted successfully" });
    } catch (error) {
        console.error("Error deleting submission:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});



module.exports = 
{
  ContactRouter
}
