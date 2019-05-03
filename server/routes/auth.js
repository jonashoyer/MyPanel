const express = require("express")
dbUser = require("../models/user")
, router = express.Router();

router.post("/",(req,res)=>{
    const {email,password} = req.body.credentials;
    dbUser.find({email}).limit(1).exec((err,result)=>{

        const user = result[0];
        
        if(!user || err || !user.isValidPassword(password)){
            res.status(400).json({errors:{global:"Username/password incorrect"}});
            return;
        }

        res.json({user:user.toAuthJson()});

    });
})

module.exports = router;