const express = require("express")
, dbWhitelist = require("../models/whitelist")
, authMiddle = require("../middlewares/auth")
, router = express.Router();

router.use(authMiddle);

router.post("/whitelist",(req,res) =>{

    if(!req.currentUser.beta_canInvite){
      return res.status(400).json({errors:"You are not authorized"});
    }
  
    const {email} = req.body;
  
    let doc = new dbWhitelist();
    doc.email = email;
    doc.canInvite = true;
    doc.save((e)=>{
      if(e) return res.status(400).json({errors:e});
      res.send("OK");
    })
  })

module.exports = router;
