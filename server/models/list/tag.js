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
    name:{
        type:String,
        required: true
    },
    color:{
        type:Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("tag",schema);