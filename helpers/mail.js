const nodemailer = require("nodemailer");

const sendMail = async (to, subject, content) => {

    // Only needed if you don't have a real mail account for testing
    await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({

        host: "mail.rkanjel.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.USER_MAIL || 'no-reply@rkanjel.com', // generated ethereal user
            pass: process.env.USER_PASS || 'Moda@123456' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: '"rKanjel👻 "<no-reply@rkanjel.com>', // sender address,
        to: to, // list of receivers
        subject: subject, // Subject line
        text: "", // plain text body
        html: content // html body
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOptions);
};


module.exports = sendMail;