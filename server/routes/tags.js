const express = require("express")
, dbUser = require("../models/user")
, dbTag = require("../models/list/tag")
, authMiddle = require("../middlewares/auth")
, listAuthMiddle = require("../middlewares/listAuth")
, router = express.Router();

router.use(authMiddle);
router.use(listAuthMiddle);

const errHandler = (res,err) => res.status(400).json({errors:err});

router.post("/",(req,res)=>{
    dbTag.find({listId:req.body.id},"-createBy -__v -listId")
    .then(data => res.json({id:req.body.id, data}))
    .catch(err => errHandler(res,err) )
})

router.post("/create", (req,res) => {
    
    const userId = req.currentUser._id, {value,id,colorIndex} = req.body;

    dbTag.create({createBy: userId, name:value, listId: id,color: colorIndex})
    .then(tag => res.json({tag}))
    .catch(err => errHandler(res,err));
})

router.post("/delete", (req,res)=> {
    dbTag.remove({_id: req.body.tagId, listId: req.body.id})
    .then(()=> res.json(req.body))
    .catch(err => errHandler(res,err))
})

module.exports = router;