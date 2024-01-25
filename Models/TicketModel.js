const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Open',
        enum: ['Open', 'In Progress', 'Closed'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            text: String,
        },
    ],
    autoReply: {
        type: String,
        default: 'Thank you for reaching out. We will get back to you shortly.',
    },
}, { timestamps: true });

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = {
    TicketModel,
};