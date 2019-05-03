const express = require("express")
, dbUser = require("../models/user")
, dbList = require("../models/list/list")
, dbTimer = require("../models/list/timer")
, dbTimespan = require("../models/list/timespan")
, authMiddle = require("../middlewares/auth")
, listAuthMiddle = require("../middlewares/listAuth")
, router = express.Router();

router.use(authMiddle);
router.use(listAuthMiddle);

const debug = true;

const errorHandler = (res, err) => {res.status(400).json({errors: err}); if(debug) console.error(err);};

router.post("/get",(req,res)=>{

    dbTimer.find({listId: req.body.id}).sort({_id:-1}).populate({
        path:"spans",
        populate:{
            path:"userId",
            select:"name _id"
        }
    })
    .then(data => res.json({id: req.body.id, data}))
    .catch(err => errorHandler(res,err));
});

router.get("/timer",(req,res)=>{
    
    dbTimespan.find({userId: req.currentUser._id, end:{$exists: false}})
    .populate({path: 'timer', populate: {path : 'listId'}})
    .then(r => res.json({active: r[0]}))
    .catch(err => errorHandler(res,err));
});

router.post("/start", (req, res) => {

    isTimerActive(req, res, () => {

        const {value,id,isEncrypted} = req.body;

        //FIXME: Useless with encryption
        //Check of exist timer by same name
        dbTimer.find({name: value,listId:id}).then((docs)=>{

            let t;

            if(docs.length === 0 ){
                t = new dbTimer();
                t.isEncrypted = isEncrypted;
                t.name = value;
                t.listId = id;
                t.createBy = req.currentUser._id;
            }else{
                t = docs[0];
            }
            
            
            let ts = new dbTimespan();
            ts.userId = req.currentUser._id;
            ts.timer = t._id;
            
            t.spans = [ts._id];
            
            ts.save()
            .then(() => {
                
                t.save()
                .then(() => {
                    dbList.findById(req.body.id, { name: 1 }, (err, list) => {
                        
                        if (err) return errorHandler(res,err);
                        
                        t.spans = [ts];
                        res.json({ listId: req.body.id, time: t, listName: list.name });
                    });
                })
                
            })
            .catch(err => errorHandler(res,err));
        });
    });
});

router.post("/continue",(req,res)=>{

    isTimerActive(req,res,()=>{
        
        let ts = new dbTimespan();
        ts.userId = req.currentUser._id;
        ts.timer = req.body.timeId;
        
        dbTimer.findByIdAndUpdate(req.body.timeId,{$push:{spans: ts._id}}).exec();

        ts.save()
        .then(()=>{
            dbTimer.findById(req.body.timeId)
            .then( t =>{
                dbList.findById(req.body.id, { name: 1 })
                .then(l => {
                    t.spans = [ts];
                    res.json({listId: req.body.id, time: t, listName: l.name});
                })
            })
        })
        .catch(err => errorHandler(res,err));
    });
});

router.post("/stop",(req,res)=>{
    let now = new Date();
    dbTimespan.update({_id: req.body.spanId, userId: req.currentUser._id},{end: now}).exec((err)=>{
        if(err) return err => errorHandler(res,err);
        
        dbTimespan.find({_id:req.body.spanId}).populate({path : 'timer', populate : {path : 'listId'}})
        .then(r =>{
            r = r[0];
            res.json({spanId: r._id,listId:r.timer.listId._id,timeId:r.timer._id,end:r.end});
        })
        .catch(err => errorHandler(res,err)); 
    });
});

router.post("/rename",(req,res)=>{

    const {id,timeId,value,isEncrypted} = req.body;

    dbTimer.update({_id:timeId, listId: id},{name:value,isEncrypted})
    .then(() => res.json({listId:id, timeId: timeId,name:value}))
    .catch(err => errorHandler(res,err));
});

router.post("/delete",(req,res)=>{

    const cbErr = (e) => res.status(400).json({errors:e});

    dbTimer.find({_id: req.body.timeId},(err,result)=>{

        if(err) return cbErr(err);
        result[0].deleteSpans((err)=>{

            if(err) return cbErr(err);
            result[0].remove((e)=>{

                if(e) return cbErr(e);
                res.json({listId: req.body.id, timeId: req.body.timeId});
            });
        });
    });
});

router.post("/create",(req,res)=>{

    const {start, end, name,isEncrypted} = req.body.value;

    let t = new dbTimer();
    t.name = name;
    t.isEncrypted = isEncrypted;
    t.listId = req.body.id;
    t.createBy = req.currentUser._id;

    let ts = new dbTimespan();
    ts.userId = req.currentUser._id;
    ts.timer = t._id;
    ts.start = start;
    ts.end = end;

    t.spans = [ts._id];

    ts.save()
    .then(() => {

        t.save()
        .then(() => {
            t.spans = [ts];
            res.json({ listId: req.body.id, time: t });
        })
        .catch(err => errorHandler(res,err));

    })
    .catch(err => errorHandler(res,err));
});

router.post("/create-span", (req,res)=>{

    let ts = new dbTimespan();
    ts.userId = req.currentUser._id;
    ts.timer = req.body.timeId;
    ts.start = req.body.start;
    ts.end = req.body.end;

    dbTimer.findByIdAndUpdate(req.body.timeId,{$push:{spans: ts._id}}).exec();

    ts.save()
    .then(()=>{
        res.json({listId: req.body.id, timeId: req.body.timeId, span: ts});
    })
    .catch(err => errorHandler(res,err))
});

router.post("/edit-span",(req,res)=>{

    dbTimespan.update({_id: req.body.spanId, timer: req.body.timeId}, {start: req.body.start, end: req.body.end})
    .then((data)=>{
        dbTimespan.findById(req.body.spanId)
        .then((data)=>{
            res.json({listId: req.body.id, timeId: req.body.timeId, span: data});
        })
    })
    .catch(err => errorHandler(res,err))
});

router.post("/remove-span",(req,res)=>{

    dbTimespan.remove({_id: req.body.spanId, timer: req.body.timeId})
    .then(()=>{
        res.json({listId: req.body.id, timerId: req.body.timeId, spanId: req.body.spanId});
    })
    .catch(err => errorHandler(res,err))
});


router.post("/overview",(req,res)=>{
    
    dbList.find({userIds:req.currentUser._id},{_id: 1,name:1})
    .then( list => {
        
        let _date = new Date();
        _date.setHours(23,59,59);
        let now = _date.getTime();

        const date = new Date(now - 864e5 * req.body.span);

        dbTimer.find({listId: list.map(x => x._id) })
        .populate({
            path:"spans",
            match: {userId:req.currentUser._id, start:{ $gt:date }, end:{ $gt: date }}
        })
        .then(data => {

            const devider = (now - date.getTime()) / Math.min(req.body.span, 30);
            const getPos = (time) => Math.floor( (time - date.getTime()) / devider);

            let stats = {};
            let sessions = 0;
            for (let i = 0, len = data.length; i < len; i++) {

                const name = list.find(obj => (obj._id+'') == data[i].listId).name;
                let times = stats[name] || {};

                for(let x = 0,xlen = data[i].spans.length;x<xlen;x++){
                    
                    const span = data[i].spans[x];

                    const time = span.end.getTime() - span.start.getTime();
                    const index = getPos(span.end.getTime());

                    if(!times[index]) times[index] = 0;
                    times[index] += time;

                    sessions++;
                }
                
                stats[name] = Object.assign(stats[name] || {}, times);
            }

            res.json({stats,sessions});

        })

    })
    .catch( err => errorHandler(res,err))
});

function isTimerActive(req, res, cb){
    dbTimespan.count({userId: req.currentUser._id, end:{$exists: false}},(err,count)=>{
        count > 0 ? res.status(400).json({errors: "Timer Active"}) : cb();
    });
}

module.exports = router;