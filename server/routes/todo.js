const express = require("express")
, dbUser = require("../models/user")
, dbList = require("../models/list/list")
, dbTodo = require("../models/list/todo")
, authMiddle = require("../middlewares/auth")
, listAuthMiddle = require("../middlewares/listAuth")
, async = require('async')
, router = express.Router();

router.use(authMiddle);
router.use(listAuthMiddle);

router.post("/get",(req,res)=>{

    dbTodo.find({listId: req.body.id})
    .then(docs => res.json({id: req.body.id, data: docs }))
    .catch(err => res.stats(400).json({errors:err}));
});

router.post("/create",(req,res)=>{

    const {id,name,parentId,isEncrypted} = req.body;

    dbTodo.create({listId: id, name: name, createBy: req.currentUser._id,parentId:parentId,isEncrypted})
    .then(todo => {
        dbTodo.update({_id:{$ne:todo._id},nextId:null,listId:id},{nextId:todo._id}).exec();
        res.json({todo})
    })
    .catch(err => res.status(400).json({errors:err}));
});

router.post("/set-state",(req,res)=>{
    const {id,todoId,value} = req.body;
    dbTodo.update({_id:todoId,listId:id},{state: value})
    .then(()=> res.json({id, todoId,state:value}))
    .catch(err => res.status(400).json({errors: err}));
})

router.post("/rename",(req,res)=>{

    const {id,todoId,value,parentId,isEncrypted} = req.body;

    dbTodo.update({_id: todoId,listId:id},{ name:value,isEncrypted})
    .then(() => res.json({id, todoId,name:value}))
    .catch(err => res.status(400).json({errors: err}));
});

router.post("/delete",(req,res)=>{

    const {id,todoId} = req.body;

    dbTodo.find({_id:todoId,listId:id},"_id nextId").then(doc =>{

        dbTodo.update({nextId:doc[0]._id},{nextId:doc[0].nextId}).exec();

        doc[0].remove();
        res.json({id: req.body.id, todoId: req.body.todoId});

    })
    .catch(err => res.status(400).json({errors: err}));
});

router.post("/get-note",(req,res)=>{
    
    dbTodo.find({_id:req.body.todoId},{notes:1})
    .then(obj => res.json(obj[0]))
    .catch(err => res.status(400).json({errors:err}));
});

router.post("/set-note",(req,res)=>{
 
    const {id,todoId,value,isEncrypted} = req.body;

    dbTodo.update({_id: todoId,listId:id},{notes:value,isEncrypted})
    .then(()=>res.send())
    .catch(err => res.status(400).json({errors: err}));
});

router.post("/order",(req,res)=>{

    let {changes,id} = req.body;

    dbList.find({_id: id, userIds: req.currentUser._id},{_id:1})
    .then(l =>{
        if(l.length < 1){
            throw new Error("Not authorized");
        }

        async.eachSeries(changes, (rec, callback) => {

            dbTodo.update({_id:rec._id, listId:id},{nextId: rec.nextId}).exec(callback);

        }, (err) => {

            if(err) throw new Error(err);
            res.json({changes});

        });
    })
    .catch(err => res.status(400).json({errors:err}))
})

router.post("/add-tag",(req,res)=>{

    const {id,todoId,tagId} = req.body;

    dbTodo.update({_id:todoId,listId:id},{$push:{tags:tagId}})
    .then(() => res.json(req.body))
    .catch(err => res.status(400).json({errors:err}))

})

router.post("/remove-tag",(req,res)=>{

    const {id,todoId,tagId} = req.body;

    dbTodo.update({_id:todoId,listId:id},{$pull:{tags:tagId}})
    .then(() => res.json(req.body))
    .catch(err => res.status(400).json({errors:err}))

})

module.exports = router;