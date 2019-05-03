const mongoose = require("mongoose")
, bcrypt = require("bcrypt")
, jwt = require("jsonwebtoken")
, uniqueValidator = require("mongoose-unique-validator");

const config = require("../config.json")

// TODO: add uniqueness and email validations to email field
const schema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        lowercase:true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    confirmed: { type: Boolean, default: false },
    confirmationToken: { type: String, default: "" },
    beta_canInvite:{
        type:Boolean,
        default:false
    },

    tier:{
        type:Number,
        required: true,
        default:0
    }
});

schema.methods.setPassword = function setPassword(password) {
    this.password = bcrypt.hashSync(password, 10);
};

schema.methods.isValidPassword = function isValidPassword(password){
    return bcrypt.compareSync(password, this.password);
}

schema.methods.toAuthJson = function toAuthJson(){
    return {
        name: this.name,
        email: this.email,
        confirmed: this.confirmed,
        token: this.generateJWT(),
    };
}

schema.methods.generateJWT = function generateJWT(){

    return jwt.sign(
        {
            name: this.name,
            email: this.email,
            confirmed: this.confirmed,
            betaInviter: this.beta_canInvite
        },
        config.SECRET
    );
}

schema.methods.setConfirmationToken = function setConfirmationToken() {
    this.confirmationToken = this.generateJWT();
};


module.exports = mongoose.model("user",schema);