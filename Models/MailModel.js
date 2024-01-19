const mongoose = require("mongoose");

const mailSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const MailModel = mongoose.model("MailForm", mailSchema);

module.exports = {
    MailModel,
};
