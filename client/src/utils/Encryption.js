let crypto = require('crypto')
, algorithm = 'aes-256-ctr';

export const encrypt = (pass, text) => {
    
    let iv = crypto.randomBytes(16);

    let cipher = crypto.createCipheriv(algorithm,pass,iv);
    let crypted = iv.toString('base64')
    + cipher.update(text,'utf8','base64')
    + cipher.final('base64')

    return crypted;
}

export const decrypt = (pass, encrypted) => {

    let iv = new Buffer(encrypted.slice(0,24),'base64');
    encrypted = encrypted.slice(24);

    let decipher = crypto.createCipheriv(algorithm,pass,iv);
    let text = decipher.update(encrypted,'base64','utf8')
    + decipher.final('base64');

    return text;
}