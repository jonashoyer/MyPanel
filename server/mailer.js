const nodemailer = require("nodemailer");

const from = '"My panel" <no-reply@mypanel.com>'
, config = require("./config.json");

//TODO: Set nodemailer login
function setup() {
  return nodemailer.createTransport({
    host: config.EMAIL.HOST,
    port: config.EMAIL.PORT,
    auth: {
      user: config.EMAIL.USER,
      pass: config.EMAIL.PASS
    }
  });
}

module.exports = {

    sendConfirmationEmail:(user)=> {
        const tranport = setup();
        const email = {
            from,
            to: user.email,
            subject: "Welcome to My Panel",
            text: `
            Welcome to My Panel. Please, confirm your email.
            ${user.generateConfirmationUrl()}
            `
        };
        
        tranport.sendMail(email);
    },
    
    sendResetPasswordEmail: (user)=> {
        const tranport = setup();
        const email = {
            from,
            to: user.email,
            subject: "Reset Password",
            text: `
            To reset password follow this link
            ${user.generateResetPasswordLink()}
            `
        };
        
        tranport.sendMail(email);
    }
}