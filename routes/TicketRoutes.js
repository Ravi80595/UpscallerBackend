const express = require('express');
const { TicketModel } = require('../Models/TicketModel');
const Ticketrouter = express.Router();




Ticketrouter.post('/create', async (req, res) => {
    try {
        const { title, description, createdBy } = req.body;
        const newTicket = new TicketModel({ title, description, createdBy });
        const savedTicket = await newTicket.save();
        res.status(201).json(savedTicket);
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


Ticketrouter.get('/all', async (req, res) => {
    try {
        const tickets = await TicketModel.find();
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


Ticketrouter.put('/:ticketId/status', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { status } = req.body;
        const updatedTicket = await TicketModel.findByIdAndUpdate(
            ticketId,
            { status },
            { new: true }
        );
        res.status(200).json(updatedTicket);
    } catch (error) {
        console.error('Error updating ticket status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


Ticketrouter.post('/:ticketId/reply', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { user, text } = req.body;
        const updatedTicket = await TicketModel.findByIdAndUpdate(
            ticketId,
            {
                $push: { comments: { user, text } },
            },
            { new: true }
        );
        res.status(200).json(updatedTicket);
    } catch (error) {
        console.error('Error replying to ticket:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


Ticketrouter.get('/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const ticketsForUser = await TicketModel.find({ createdBy: userId });
      res.status(200).json(ticketsForUser);
    } catch (error) {
      console.error('Error fetching tickets for user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = 
{
  Ticketrouter
}