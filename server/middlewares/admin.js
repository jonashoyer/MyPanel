const jwt = require("jsonwebtoken")
, dbUser = require("../models/user")
, dbList = require("../models/list/list");
module.exports = (req, res, next) => {

    const listId = req.params.listId || req.body.id;
    if(!listId) return next();

    dbList.find({_id:listId,ownerId:req.currentUser._id}).then(result=>{
        if(result === 0) return next();
        req.currentUser.isAdmin = true;
        next();

    }).catch(err => next(err));
};