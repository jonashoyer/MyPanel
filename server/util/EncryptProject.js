const dbTodo = require("../models/list/todo")
, dbPassword = require("../models/list/password")
, dbNote = require("../models/list/note")
, dbTimer = require("../models/list/timer")
, crypto = require("crypto");

const algorithm = 'aes-256-ctr';

module.exports = {
    EncryptProject: (id, secretKey) => 
        EncryptArray(id,secretKey,dbTodo,["name","notes"]).then(
            EncryptArray(id,secretKey,dbPassword,['name'])
        ).then(
            EncryptArray(id,secretKey,dbNote,['note'])
        ).then(
            EncryptArray(id,secretKey,dbTimer,['name'])
        ).then()
        
    //    .then( () => EncryptArray(id,secretKey,) )
    ,
    DecryptProject: (id, secretKey) => 
        DecryptArray(id,secretKey,dbTodo,["name","notes"]).then(
            DecryptArray(id,secretKey,dbPassword,['name'])
        ).then(
            DecryptArray(id,secretKey,dbNote,['note'])
        ).then(
            DecryptArray(id,secretKey,dbTimer,['name'])
        ).then()
}

const EncryptArray = (id,secretKey,schema, fields) => {

    return schema.find({listId:id,$or:[{isEncrypted:false},{isEncrypted:undefined}]},fields.join(' ')).then( docs => {

        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            
            let update = {isEncrypted:true};
            for (let x = 0; x < fields.length; x++) {
                const f = fields[x];
                if(!doc[f]) continue;
                update[f] = EncryptItem(secretKey,doc[f]);
            }        
            
            schema.findByIdAndUpdate(doc._id, update).exec();

        }
    })
}

const EncryptItem = (phrase,text) => {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, phrase, iv);

    let encrypted = iv.toString("base64")
    + cipher.update(text, 'utf8', 'base64')
    + cipher.final('base64');
    return encrypted;
}

const DecryptArray = (id,secretKey,schema, fields) => {

    return schema.find({listId:id,isEncrypted:true},fields.join(' ')).then( docs => {

        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            
            let update = {isEncrypted:undefined};
            for (let x = 0; x < fields.length; x++) {
                const f = fields[x];
                if(!doc[f]) continue;
                update[f] = DecryptItem(secretKey,doc[f]);
            }        
            
            schema.findByIdAndUpdate(doc._id, update).exec();

        }
    })
}

const DecryptItem = (phrase,value) => {

    try{

        let iv = new Buffer(value.slice(0, 24), "base64");
        let cipher = crypto.createDecipheriv(algorithm, phrase, iv);
    
        var text = cipher.update(value.slice(24), 'base64', 'utf8')
          + cipher.final('utf8');
    }
    catch(e){
        console.log("Decryption Error: " + e)
        return value;
    }
    return text;
}