const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        lowercase:true,
        unique: true
    },
    canInvite:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model("whitelist",schema);