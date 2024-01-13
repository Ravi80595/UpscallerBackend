const express = require("express");
const { ContactModel } = require("../Models/ContactModel");
const ContactRouter = express.Router();



ContactRouter.post("/submit", async (req, res) => {
    try {
        // Extract data from the request body
        const { name, email, phone, message } = req.body;

        // Create a new instance of the ContactFormModel
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

module.exports = 
{
  ContactRouter
}
