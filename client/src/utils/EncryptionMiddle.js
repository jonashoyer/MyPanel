import React from 'react'
import { connect } from 'react-redux'
import crypto from "crypto";

const algorithm = 'aes-256-ctr';

export const DecryptFieldMiddle = (id,object,fields) => {

  if(!object["isEncrypted"] && !fields.includes["password"]){
    return object;
  }

    const lists = window.store.getState()['list']['lists'];
    var _list = lists.find(x=>x._id == id);
    if(!_list) {
      console.error("List not found, for encryption middleware!");
      return object;
    }

  if(_list['encryption']){

    // if(!ignoreEncrypLevel && _list["encryptionLevel"] !== "full") return value; 

    let _phrase = _list['encryption']['phrase'];
    
    if(_phrase){

      const DecryptItem = (value) => {
        try{
  
          let iv =  new Buffer(value.slice(0,24),"base64");
          let cipher = crypto.createDecipheriv(algorithm, _phrase, iv);
          
          let text = cipher.update(value.slice(24), 'base64', 'utf8')
          + cipher.final('utf8');
          
          return text;
        }
        catch(err){
          return value;
        }
      }

      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        if(!object[f]) continue;
        
        object[f] = DecryptItem(object[f]);
      }
      
      return object;

    }else{
      console.error("Encryption Key not unlocked!");
      return object;
    }
  }  

  return object;

}

export const EncryptFieldMiddle = (id, obj, fields) => {
  const lists = window.store.getState()['list']['lists'];

  
  const NoEncrypt = () => {
    console.log("No Encrypt");
    return {
      ...obj,
      isEncrypted: false
    };
  }

  const _list = lists.find(x=>x._id == id);
  if(!_list) {
    console.error("List not found, for encryption middleware!");
    return NoEncrypt();
  }

  if(_list['encryptionStatus'] != 'encrypted' && _list['encryptionStatus'] != 'encrypting'){
    if(!fields.includes('password')) return NoEncrypt();

    fields = ['username','password'];
    var NotFullEncryption = true;
  }

  
  if(_list['encryption']){
    // if(!ignoreEncrypLevel && _list["encryptionLevel"] !== "full") return NoEncryp(); 
    
    let phrase = _list['encryption']['phrase'];
    if(phrase){

      const EncrypItem = (value) => {
        let iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv(algorithm, phrase, iv);
  
        let encrypted = iv.toString("base64")
        + cipher.update(value, 'utf8', 'base64')
        + cipher.final('base64');
  
        return encrypted;
      }

      
      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        if(!obj[f]) continue;

        obj[f] = EncrypItem(obj[f]);
      }

      return {
        ...obj,
        isEncrypted: !NotFullEncryption
      };

    }else{
      console.error("Encryption Key not unlocked!");
      return NoEncrypt();
    }
  }

  return NoEncrypt();
}

export const DecryptFieldMiddlePhrase = (phrase,obj,fields) => {
  
  if(!obj["isEncrypted"] ){
    if(!fields.includes("password")) return obj;
    fields = ["username","password"];
  }

  const DecryptItem = (value) => {
    try {

      let iv = new Buffer(value.slice(0, 24), "base64");
      let cipher = crypto.createDecipheriv(algorithm, phrase, iv);

      let text = cipher.update(value.slice(24), 'base64', 'utf8')
        + cipher.final('utf8');

      return text;
    }
    catch (err) {
      console.log("ERROR");
      console.log(err);
      return value;
    }
  }

  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    if (!obj[f]) continue;
    obj[f] = DecryptItem(obj[f]);
    
  }
  return obj;

}