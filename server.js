require('dotenv').config();
const express = require('express');
const generateOtp = require('./src/routes/send_email.js')
const verifyOtp = require('./src/routes/verify_email.js');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/email-verification', generateOtp);
app.use('/email-verification', verifyOtp);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
