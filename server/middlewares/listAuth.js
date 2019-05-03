const dbList = require("../models/list/list")
, dbTodo = require("../models/list/todo")
, dbPass = require("../models/list/password");

const bypass = ["/timer","/stop","/overview","/order"]

module.exports = (req, res, next)=>{

    if(bypass.indexOf(req.path) > -1 ) return next();

    dbList.find({_id:req.body.id, userIds: req.currentUser._id},(err,query)=>{
        if(!query || query.length < 1 || err) return res.status(400).json({errors: "Bad Request"});
        
        if(req.body.todoId)
            dbTodo.find({_id: req.body.todoId, listId: req.body.id}, queryHandler);
        else if (req.body.passId)
            dbPass.find({_id: req.body.passId, listId: req.body.id}, queryHandler);
        else
            next();
    });

    function queryHandler (err, query){
        if(!query || query.length < 1 || err) return res.status(400).json({errors: "Bad Request"});
        next();
    }
}

