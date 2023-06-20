const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'kishancoc99@gmail.com',
        pass: 'ibhqkbqskwqfwjqc'
    }

});


const otpMail = (email, otp) => {

    var mailOptions = {
        to: email,
        subject: "OTP for hotwallet Account",
        text: 'Hello to myself!',
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2 ; background-color:black ; color:white">
        <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #0abb92;text-decoration:none;font-weight:600">hotwallet</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Thank you for choosing hotwallet. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
            <h2 style="background: #0abb92;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff !important;border-radius: 4px;">${otp}</h2>
            <p style="font-size:0.9em;">Regards,<br />hotwallet</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>hotwallet</p>
                <p>The Capital </p>
                <p>Ahmedabad</p>
            </div>
        </div>
    </div>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return error;
        }
        else {
            return 200;
        }
    });
}


module.exports = { otpMail };