const express = require("express");
const { PaymentModel } = require("../Models/PaymentModel");
const PaymentRouter = express.Router();



PaymentRouter.post('/create', async (req, res) => {
    try {
    //   const { projectId } = req.params;
      const { title, description, amount, dueDate,project} = req.body;
      const newMilestone = new PaymentModel({
        project,
        title,
        description,
        amount,
        dueDate,
      });
      await newMilestone.save();
      res.json(newMilestone);
    } catch (error) {
      console.error('Error creating payment milestone:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


PaymentRouter.put('/milestone/:milestoneId', async (req, res) => {
    try {
      const { milestoneId } = req.params;
      const updateFields = req.body;
      const updatedMilestone = await PaymentModel.findByIdAndUpdate(
        milestoneId,
        { $set: updateFields },
        { new: true }
      );
      if (!updatedMilestone) {
        return res.status(404).json({ error: 'Payment milestone not found' });
      }
      res.json(updatedMilestone);
    } catch (error) {
      console.error('Error updating payment milestone:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


PaymentRouter.get('/payments/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      // Assuming 'project' is a field in the PaymentModel that references the ProjectModel
      const payments = await PaymentModel.find({ project: projectId });
  
      res.json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

PaymentRouter.delete('/milestone/:milestoneId', async (req, res) => {
    try {
      const { milestoneId } = req.params;
      const deletedMilestone = await PaymentModel.findByIdAndDelete(milestoneId);
      if (!deletedMilestone) {
        return res.status(404).json({ error: 'Payment milestone not found' });
      }
      res.json({ message: 'Payment milestone deleted successfully' });
    } catch (error) {
      console.error('Error deleting payment milestone:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports={
  PaymentRouter
}
