const express = require('express');
const router = express.Router();
const { decode } = require("../middlewares/encryption");
const { deleteOtp, checkOtp } = require('../services/otp_service')

var dates = {
    convert: function (d) {
        return (
            d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0], d[1], d[2]) :
                    d.constructor === Number ? new Date(d) :
                        d.constructor === String ? new Date(d) :
                            typeof d === "object" ? new Date(d.year, d.month, d.date) :
                                NaN
        );
    },
    compare: function (a, b) {
        return (
            isFinite(a = this.convert(a).valueOf()) &&
                isFinite(b = this.convert(b).valueOf()) ?
                (a > b) - (a < b) :
                NaN
        );
    },
    inRange: function (d, start, end) {
        return (
            isFinite(d = this.convert(d).valueOf()) &&
                isFinite(start = this.convert(start).valueOf()) &&
                isFinite(end = this.convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN
        );
    }
}

router.post('/verify-email', async (req, res) => {

    try {
        console.log("Requested URL: /verify-email")

        const { otp, email} = req.body;
        var currentDate = new Date();

        if (!otp && !email) {
            const response = { "Status": "Failure", "Details": "Invalid Request" }
            return res.status(200).send(response)
        }

        let emailValidation = RegExp(process.env.EMAIL_VERIFICATION_SYNTEX)
        if (emailValidation.test(email)) {

            let otpObject = await checkOtp(email)

            if (!otpObject.data[0]) {
                console.log("The email does not exist in the record");
                const response = { "Status": false, "Details": "The Email Does Not Exists In The Record" }
                return res.status(200).send(response)
            }
            let otpDetail = otpObject.data[0].otp_detail
            const decoded = await decode(otpDetail)
            const parsedDecoded = JSON.parse(decoded)
            
            if (dates.compare(parsedDecoded.expiration_time, currentDate) == 1) {

                let response;
                if (otp == parsedDecoded.otp) {
                    deleteOtp(email);
                    response = res.status(200).send({ "Status": true, "Details": "OTP Matched" })
                } else {
                    response = res.status(200).send({ "Status": false, "Details": "OTP Did Not Matched" })
                }
                return response

            } else if (dates.compare(parsedDecoded.expiration_time, currentDate) != 1) {
                deleteOtp(email);
                return res.status(200).send({ "Status": false, "Details": "OTP Has Expired" })

            }

        } else {
            const response = { "Status": false, "Details": "Invalid Email" }
            return res.status(200).send(response)
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send({ "Status": false, "Details": "Please Try Again Something Went Wrong!" })
    }
})

module.exports = router;
