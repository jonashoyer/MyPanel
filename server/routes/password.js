const express = require("express")
, dbUser = require("../models/user")
, dbList = require("../models/list/list")
, dbPassword = require("../models/list/password")

, authMiddle = require("../middlewares/auth")
, listAuthMiddle = require("../middlewares/listAuth")
, async = require('async')
, router = express.Router();

router.use(authMiddle);
router.use(listAuthMiddle);

router.post("/get",(req,res)=>{

    dbPassword.find({listId: req.body.id})
    .then(data => res.json({id: req.body.id, data}))
    .catch(err => res.stats(400).json({errors:err}));
});

router.post("/create",(req,res)=>{


    const {id,title,username,password,isEncrypted} = req.body;

    dbPassword.create({listId: id, name: title, username,password,isEncrypted, createBy: req.currentUser._id})
    .then(pass => {
        dbPassword.update({_id:{$ne:pass._id},nextId:null,listId:id},{nextId:pass._id}).exec();
        res.json({pass})
    })
    .catch(err => res.status(400).json({errors:err}));
});

router.post("/edit",(req,res)=>{

    const {id, passId,title, username, password} = req.body;

    dbPassword.update({ _id: passId, listId: id}, { name: title, username, password })
        .then(() => res.json({ id, passId, title, username, password }))
        .catch(err => res.status(400).json({ errors: err }));
});

router.post("/delete",(req,res)=>{

    // dbPassword.remove({_id: req.body.passId})
    // .then(()=> {
    //     res.json({id: req.body.id, passId: req.body.passId})
    // })
    // .catch(err => res.status(400).json({errors: err}));

    const {id,passId} = req.body;

    dbPassword.find({_id:passId,listId:id},"_id nextId").then(doc =>{

        dbPassword.update({nextId:doc[0]._id},{nextId:doc[0].nextId}).exec();

        doc[0].remove();
        res.json({listId: id, passId: passId});

    })
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

            dbPassword.update({_id:rec._id, listId:id},{nextId: rec.nextId}).exec(callback);

        }, (err) => {

            if(err) throw new Error(err);
            res.json({changes});

        });
    })
    .catch(err => res.status(400).json({errors:err}))
})

module.exports = router;