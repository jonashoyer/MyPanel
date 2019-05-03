const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "list",
        unique: true,
        required: true
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    cipher: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("encryptionKey",schema);