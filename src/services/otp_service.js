const { supabase } = require('../../config.js')

const insertOtp = async (otpDetails, userEmail) => {
    await supabase.from('email_verification_otp_table').insert({
        otp_detail: otpDetails,
        user_email: userEmail,
    })
}

const deleteOtp = async (userEmail) => {
    await supabase.from('email_verification_otp_table').delete().eq('user_email', userEmail)
}

const   checkOtp = async (userEmail) => {
    return await supabase.from('email_verification_otp_table').select('otp_detail').eq('user_email', userEmail)
}

const updateOtp = async (otpDetails, userEmail) => {
    return await supabase.from('email_verification_otp_table').update({ 'otp_detail': otpDetails }).eq('user_email', userEmail)

}


module.exports = { insertOtp, deleteOtp, checkOtp, updateOtp}