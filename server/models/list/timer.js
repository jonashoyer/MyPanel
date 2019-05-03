const mongoose = require("mongoose")
, dbTimespan = require("./timespan");

const schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
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
    spans:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'timespan',
        required: true
    }],
    isEncrypted:{
        type: Boolean,
        required: true
    }
});


schema.methods.deleteSpans = (cb) => {
    dbTimespan.remove({timer:this._id}).exec((err,res)=>{
        cb(err);
    });
}

module.exports = mongoose.model("timer",schema);