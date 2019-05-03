const jwt = require("jsonwebtoken")
, dbUser = require("../models/user")
, config = require("../config.json");

module.exports = (req, res, next) => {

  const header = req.headers.authorization;
  let token;

  if (header) token = header.split(" ")[1];

  if (token) {
    jwt.verify(token, config.SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ errors: { global: "Invalid token" } });
      } else {
        dbUser.find({ email: decoded.email }).limit(1).exec((err,res)=>{
          req.currentUser = res[0];
          next();
        });
      }
    });
  } else {
    res.status(401).json({ errors: { global: "No token" } });
  }
};