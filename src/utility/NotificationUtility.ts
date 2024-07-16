
export const GenerateOtp = () => {

    const otp = Math.floor(100000 + Math.random() * 900000)
    let expiry = new Date()
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))

    return {otp, expiry}

}

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {

    const accountSid = "ACe77a667e6a865e631104639801d81c46";
    const authToken = "ec42ac9f695b06fe089bce0a4e4e4650";
    const client = require('twilio')(accountSid, authToken);

    const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '+1 585 628 8814',
        to: `+91${toPhoneNumber}`,
    })

    return response
}