const express = require("express")
, dbUser = require("../models/user")
, dbList = require("../models/list/list")
, dbListSort = require("../models/list/listSort")
, authMiddle = require("../middlewares/auth")
, dbEncryptionKey = require("../models/list/encryptionKey")
, router = express.Router()
, async = require('async')
, crypto = require("crypto")

, encrypt = require("../util/EncryptProject");

router.use(authMiddle);


const errorHandler = (res, err) => res.status(400).json({errors: err});


router.get("/",(req,res)=>{


    let lists;
    let sort;
    dbList.find({userIds:req.currentUser._id})
    .then(_lists => {
        lists = _lists;
        return dbListSort.find({userId: req.currentUser._id});
        
    }).then( _sort =>{
        sort = _sort;

        const ids = lists.map( doc => doc._id);
        return dbEncryptionKey.find({listId:{$in:ids}});
        
    }).then( enc => {
        
        let finalizedLists = [];
        
        if(sort.length > 0){

            let _sort = arrayToObject(sort,"listId");
            
            for(let i = 0, len = lists.length;i<len;i++){
                let si = _sort[lists[i]._id];
                if(si && si.hidden) {
                    continue;
                }
                
                finalizedLists.push({
                    ...lists[i]._doc,
                    nextId: si ? si.nextId: null,
                    encryption: enc.find(x => x.listId == lists[i]._doc._id.toString())
                })
            }
        }

        res.json({lists:finalizedLists});
    })
    .catch(err => res.status(400).json({ errors: err }));
});

router.post("/",(req,res)=>{

    dbList.create({name: req.body.name,ownerId:req.currentUser._id, encryptionLevel: req.currentUser.tier > 0 ? "full" : "limited" , userIds: [req.currentUser._id] })
    .then(list => {

        dbListSort.update({userId: req.currentUser._id, nextId:null},{nextId: list._id},{upsert:true,new: true}).exec(()=>{
            dbListSort.update({userId: req.currentUser._id, listId:list._id},{nextId: null},{upsert:true,new: true}).exec();
        });

        res.json({list: {...list._doc} }
    )})
    .catch(err => res.status(400).json({ errors: err.errors }));
});

router.post("/rename",(req,res)=>{
    dbList.update({"_id":req.body.id, ownerId:req.currentUser._id},{name:req.body.value})
    .then(() => res.json({id:req.body.id,name:req.body.value}))
    .catch(err=>res.status.status(400).send("Error changing name!"));
});

router.post("/delete",(req,res)=>{

    const listId = req.body.id;
    const userId = req.currentUser._id;

    RemoveItemSort(listId,userId,true,(err,doc)=>{
        if(err) return errorHandler(res,err);

        res.send(doc[0]._id);
        doc[0].remove();
    })
});

const RemoveItemSort = (listId,userId,rm = true,cb) => {
    dbList.find({_id:listId,ownerId:userId}).then(doc=>{
        if(doc.length < 1)
            return cb("Not the owner!");

        dbListSort.find({nextId:listId},"_id").then(first =>{
            dbListSort.find({listId: listId},{nextId:1}).then(obj=>{
                dbListSort.update({userId: userId, nextId:first._id},{nextId: obj.nextId},{upsert:true,new: true}).exec();
                rm && dbListSort.remove({userId:userId,listId:listId}).exec();
            });
        })
        
        cb(null,doc);
        // res.send(doc[0]._id);
        // doc[0].remove(); 
    })
    .catch(err => cb(err));  
}


router.post("/order",(req,res)=>{
    
    let {changes} = req.body;

    async.eachSeries(changes, (rec, callback) => {

        dbList.findById(rec._id,{_id:1}).then(sol=>{
            if(!sol) return callback();
            dbListSort.update({userId: req.currentUser._id, listId:rec._id},{nextId: rec.nextId},{upsert:true,new: true}).exec(callback);
        });

    }, (err)=>{
     res.json({changes});
    });
});

router.post("/add-user",(req,res)=>{

    const {userId,id} = req.body;
    const users = userId.split(" ");

    dbUser.find({email:{$in:users}},"_id name")
    .then(users=>{

        const ids = users.map(x => x._id);

        dbList.update({_id:id,ownerId:req.currentUser._id},{$addToSet:{userIds:{$each:ids}}})
        .then(()=>res.json({userAdded:ids.length,users}));

        for (let i = 0; i < ids.length; i++) {
            const _id = ids[i];
            dbListSort.update({userId:_id,nextId:null},{nextId:id},{upsert:true,new: true}).exec();
            dbListSort.update({userId:_id,listId:id},{nextId:null},{upsert:true,new: true}).exec();
        }

    })
    .catch(err => errorHandler(res,err));

});


router.post("/remove-user",(req,res)=>{

    const {userId,id} = req.body;

    dbList.update({_id:id,ownerId:req.currentUser._id},{$pull:{userIds:userId}})
    .then(()=> res.json({userId}))
    .catch(err => errorHandler(res,err));
});

router.get("/hidden",(req,res)=>{
    dbListSort.find({userId:req.currentUser._id,hidden:true}).populate("listId")
    .then(hidden=>{
        res.json(hidden.map(e => e.listId));
    })
    .catch(err => errorHandler(res,err));
});

router.post("/visible",(req,res)=>{
    const {id,state} = req.body;

    RemoveItemSort(id,req.currentUser._id,false,(err)=>{
        if(err) return errorHandler(res,err);

        dbListSort.update({userId:req.currentUser._id,listId:id},{hidden:state,nextId:null},{upsert:true,new: true})
        .then(()=>{
            res.json({id,state});
        })
        .catch(err => errorHandler(res,err));
    })

})


const encryptionKeyLen = 16;
const encryptionKeyAlgorithm = "aes-256-gcm";

router.post("/create-encryption-key",(req,res) => {
    const userId = req.currentUser._id;

    dbList.find({_id:id,ownerId:userId,encryptionStatus:"none"},"_id").then( docs => {

        if(docs.length == 0){
            return res.status(400).send();
        }

        const {id,key} = req.body;
        
        const iv = crypto.randomBytes(16);
        
        let secretKey = crypto.randomBytes(encryptionKeyLen).toString("hex");
        console.log("SECRETKEY",secretKey);
        
        let bufKey = Buffer.from(key,"hex");
        
        let cipher = crypto.createCipheriv(encryptionKeyAlgorithm, bufKey, iv);
        
        let crypted = iv.toString('base64')
        crypted += cipher.update(secretKey,"utf8","base64");
        crypted += cipher.final("base64");
        crypted += cipher.getAuthTag().toString('base64');
        
        const listId = docs[0]._id;
        dbList.findByIdAndUpdate(listId,{encryptionStatus:"encrypting"}).exec();
        const doc = {
            listId: id,
            createBy: userId,
            cipher: crypted,
        };
        
        dbEncryptionKey.create(doc);


        //Encrypt Project data with secretkey!
        encrypt.EncryptProject(listId,secretKey).then(() => {
            dbList.findByIdAndUpdate(listId,{encryptionStatus:"encrypted"}).exec();
        })
        
        res.json(doc);
    })
});

router.post("/remove-encryption-key",(req,res) => {
    const userId = req.currentUser._id;
    const {id,key} = req.body;

    dbList.find({_id:id,ownerId:userId,encryptionStatus:"encrypted"},"_id").then( docs => {

        if(docs.length == 0){
            return res.status(400).send();
        }

        return dbEncryptionKey.find({listId:id});

    }).then( enc => {
        
        if(enc.length == 0 ){
            return res.status(400).send();
        }

        const cipher = enc[0].cipher;
        const iv =  new Buffer(cipher.slice(0,24),"base64");
        const tag = new Buffer(cipher.slice(-24),'base64');
        const encrypted = cipher.slice(24,-24);

        let decipher = crypto.createDecipheriv(encryptionKeyAlgorithm, key, iv);

        decipher.setAuthTag(tag);
        
        let secret;
        try{
            secret = decipher.update(encrypted, 'base64',"utf8");
            secret +=  decipher.final('utf8');            

        }catch(err){
            return res.status(400).send();
        }

        dbList.findByIdAndUpdate(listId,{encryptionStatus:"decrypting"}).exec();

        encrypt.DecryptProject(id,secret).then(() => {
            dbList.findByIdAndUpdate(listId,{encryptionStatus:"none"}).exec();
            dbEncryptionKey.findByIdAndRemove(enc._id).exec();
        })
        
        res.send("OK");
    } )
})

router.post("/encrytion-key",(req,res) => {
    const {id} = req.body;

    dbEncryptionKey.find({listId:id},"listId cipher").then( docs => {
        if(docs.length == 0) return res.json({listId:id,cipher:null});

        res.json(docs[0]);
    });
    
})


module.exports = router;