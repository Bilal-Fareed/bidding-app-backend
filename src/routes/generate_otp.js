const express = require('express');
const router = express.Router();
const { encode } = require("../middlewares/encryption");
const { updateOtp, insertOtp, checkOtp } = require('../services/otp_service')
const {sendMail} = require('../middlewares/email_sender')
var otpGenerator = require('otp-generator');


router.post('/generateOTP', async (req, res) => {

    function AddMinutesToDate(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }

    try {
        console.log("Request URL: /generateOTP")
        //Generating OTP
        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const now = new Date();
        const expiration_time = AddMinutesToDate(now, 3);

        const { email } = req.body;

        let emailValidation = RegExp(process.env.EMAIL_VALIDATION_SYNTEX)

        if (!email) {
            const response = { "Status": false, "Otp": "", "Message": `${''}`, "Details": "Email not provided" }
            return res.status(200).send(response)
        }
        if (emailValidation.test(email)) {
            var details = {
                otp: otp,
                expiration_time: expiration_time
            }
            // Object encryption
            const encoded = await encode(JSON.stringify(details))
            const emailExists = await checkOtp(email);

            if (emailExists.data.length == 0) {
                //Storing in databse
                insertOtp(encoded, email)
                sendMail(otp, email)
                let response = res.status(200).send({ "Status": true, "Otp": `${otp}`, "Details": "Otp Sended Successfully" });
                return response
            } else {
                updateOtp(encoded, email)
                sendMail(otp, email)
                let response = res.status(200).send({ "Status": true, "Otp": `${otp}`, "Details": "Otp Sended Successfully" });
                return response
            }

        } else {
            return res.status(200).send({ "Status": false, "Otp": "", "Details": "Invalid Email" });
        }
    } catch (error) {
        console.error(error)
        const response = { "Status": false, "Otp": "", "Message": `${''}`, "Details": "Something Went Wrong Please Try Again" }
        return res.status(400).send(response)
    }
});

module.exports = router;
