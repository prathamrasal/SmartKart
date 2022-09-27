const nodemailer  = require('nodemailer');

 const sendEmail = (reciever)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        secure : false,
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.Email_Pass,
        },
      });
    var mailOptions = {
        from: "decentralised@flipkart.com", // sender address
        to: `${reciever} , ${process.env.ADMIN_MAIL}`, // list of receivers
        subject: `Flipkart Waranty System`,
        text:"Your Warranty NFT has been Minted Please Visit Your Accont Page "
        // html : emailTemplate(orderData)
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

module.exports = {sendEmail};