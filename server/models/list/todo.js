const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    listId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"list",
        required: true
    },
    name:{
        type: String,
        required: true
    },
    createBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    state:{
        type: Boolean,
        default: false
    },
    notes:{
        type: String,
        required: false
    },
    nextId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"todo",
        default: null
    },
    tags:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tag',
        required: false
    }],
    parentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"todo",
        default:null
    },
    isEncrypted:{
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("todo",schema);