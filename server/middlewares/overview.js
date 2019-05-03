const dbList = require("../models/list/list");

const errHandler = (res,err) => res.status(400).json({errors:err});

module.exports = (req, res, next) => {
    const listId = req.body.id;

    dbList.find({_id:listId,userIds:req.currentUser._id},"_id").then(result=>{
        if(result.length === 0) return errHandler(res,"Not authorized");
        next();
    })
    .catch(err => errHandler(res,err));
};