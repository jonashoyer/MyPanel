const express = require("express")
, dbUser = require("../models/user")
, dbNote = require("../models/list/note")
, authMiddle = require("../middlewares/auth")
, listAuthMiddle = require("../middlewares/listAuth")
, router = express.Router();

router.use(authMiddle);
router.use(listAuthMiddle);

const errHandler = (res,err) => res.status(400).json({errors:err});

router.post("/",(req,res)=>{
    dbNote.find({listId:req.body.id}).populate("createBy")
    .then(data => res.json({id:req.body.id, data}))
    .catch(err => errHandler(res,err) )
})

router.post("/add", (req,res) => {
    let n = new dbNote();
    n.listId = req.body.id;
    n.createBy = req.currentUser._id;
    n.isEncrypted = false;
    n.save((e)=>{
        if(e) return errHandler(res,e);
        res.json(n);
    })
})

router.post("/set", (req,res)=>{

    const {noteId,id,value,isEncrypted} = req.body;

    dbNote.update({_id:noteId,listId: id},{note:value,isEncrypted})
    .then(() => res.json(req.body))
    .catch(err => errHandler(res,err))
});

router.post("/delete", (req,res)=> {
    dbNote.remove({_id: req.body.noteId, listId: req.body.id})
    .then(()=> res.json(req.body))
    .catch(err => errHandler(res,err))
})

router.post("/order",(req,res)=>{
    const {noteId,id,i} = req.body;
    dbNote.update({_id:noteId,listId:id},{pos:i})
    .then(()=>{
        res.send("OK");
    })
    .catch(err => errHandler(res,err))
})


module.exports = router;