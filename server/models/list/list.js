const mongoose = require("mongoose")
const dbUser = require("../user");

const config = require("../../config.json")

const schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    userIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    encryptionStatus:{
        type: String,
        required: true,
        default:"none"
    }
});

schema.methods.addusers = function(users){
    return new Promise(function (resolve, reject) {
        this.userIds = this.userIds.concat(users.map(u => u._id));
        this.save(e => e ? reject(Error("Error: Invaild")) : resolve() );
    });
}
    
module.exports = mongoose.model("list",schema);