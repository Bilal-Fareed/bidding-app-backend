const nodeMailer = require("nodemailer");


async function sendMail(otp, userEmail) {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            user: 'imranalishahani7@gmail.com',
            pass: 'oureszckhwscunhy',
        },
    });

    const info = await transporter.sendMail({
        from: 'imranalishahani7@gmail.com', // sender address
        to: userEmail, // list of receivers
        subject: "Neelaam Ghar Verification Code", // Subject line
        text: "Neelaam Ghar Verification Code", // plain text body
        html: `<p>This is <b>Imran Ali Shahani</b> from <b>Codaira</b><br><h2>Your Verification Code is <b>${otp}</b></h2></p>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Message Response: ", info.response);

}

module.exports = {sendMail};