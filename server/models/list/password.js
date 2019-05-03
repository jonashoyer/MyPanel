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
    username:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    createBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true
    },
    nextId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"password",
        required: false
    },
    isEncrypted:{
        type: Boolean,
        required: true
    }
    
});

module.exports = mongoose.model("password",schema);