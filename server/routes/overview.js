const express = require("express")
, dbUser = require("../models/user")
, dbList = require("../models/list/list")
, dbTodo = require("../models/list/todo")
, dbTimer = require("../models/list/timer")
, dbPassword = require("../models/list/password")
, dbNote = require("../models/list/note")
, authMiddle = require("../middlewares/auth")
, adminMiddle = require("../middlewares/admin")
, overviewMiddle = require("../middlewares/overview")
, router = express.Router();

router.use(authMiddle);
router.use(overviewMiddle);

const errHandler = (res,err) => res.status(400).json({errors:err});

router.post("/",(req,res)=>{
    
    const {id} = req.body;
        
    Promise.all([
        dbList.find({_id:id}).lean().populate("userIds","name _id"),
        dbTodo.count({listId:id}),
        dbTodo.count({listId:id,state:true}),
        dbNote.count({listId:id}),
        dbPassword.count({listId:id}),
    ]).then( ([list,todoCount,doneTodoCount,noteCount,passwordCount]) =>{

        list = list[0];
        const isAdmin = list.ownerId.toString() == req.currentUser._id;
        const userId = req.currentUser._id;

        res.json({id,list,todoCount,doneTodoCount,noteCount,passwordCount,isAdmin,userId});
    })
})

router.post("/timer",(req,res)=>{

    const {id,span} = req.body;

    let _date = new Date();
        _date.setHours(23,59,59);
        let now = _date.getTime();

        const date = new Date(now - 864e5 * span);

        dbTimer.find({listId: id, })
        .populate({
            path:"spans",
            match: {start:{ $gt:date }, end:{ $gt: date }}
        })
        .then(data => {

            const devider = (now - date.getTime()) / Math.min(span, 30);
            const getPos = (time) => Math.floor( (time - date.getTime()) / devider);

            let stats = {};
            let sessions = 0;
            for (let i = 0, len = data.length; i < len; i++) {

                for(let x = 0,xlen = data[i].spans.length;x<xlen;x++){
                    
                    const span = data[i].spans[x];

                    const time = span.end.getTime() - span.start.getTime();
                    const index = getPos(span.end.getTime());

                    if(!stats[index]) stats[index] = 0;
                    stats[index] += time;

                    sessions++;
                }
            }

            res.json({stats,sessions,span});

        })

});

module.exports = router;