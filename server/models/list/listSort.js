const mongoose = require("mongoose")

const config = require("../../config.json")

const schema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    listId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"list",
        required: true
    },
    nextId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: null
    },
    hidden:{
        type:Boolean,
        required:false,
        default:false
    }
});
    
module.exports = mongoose.model("listSort",schema);