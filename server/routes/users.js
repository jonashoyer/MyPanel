const express = require("express")
, dbUser  = require("../models/user")
, dbWhitelist = require("../models/whitelist")
//  parseErrors  = require( "../utils/parseErrors"),
// { sendConfirmationEmail }  = require( "../mailer");

, router = express.Router();


router.post("/", (req, res) => {

  const {name, email, password } = req.body.user;

  dbWhitelist.find({email}).then(docs =>{

    if(docs.length === 0) return res.status(400).json({errors:{global:"Signup restricted (Only Beta Testers)"}}); 
    
    dbUser.find({email}).then( result =>{
      if(result.length > 0) return res.status(400).json({errors:{global:"Username or email already in use!"}});

      const user = new dbUser({name,email});

      if(docs[0].canInvite) user.beta_canInvite = true;

      user.setPassword(password);
      user.setConfirmationToken();
      user.save()
      .then(userRecord => {
        // sendConfirmationEmail(userRecord);
        res.json({ user: userRecord.toAuthJson() });
      })
    })
  })
  .catch(err => res.status(400).json({ errors: err.errors }));
  
});



module.exports = router;