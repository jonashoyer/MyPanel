const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    start:{
        type: Date,
        default: Date.now
    },
    end:{
        type: Date,
        required: false
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    timer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'timer',
        required: true
    }
});

module.exports = mongoose.model("timespan",schema);