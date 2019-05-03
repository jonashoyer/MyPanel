const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    listId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"list",
        required: true
    },
    createBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    note:{
        type: String,
        required: false
    },
    pos:{
        type:Number,
        required:false
    },
    isEncrypted:{
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("note",schema);