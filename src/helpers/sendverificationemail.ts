import { getResendClient } from "@/src/lib/resend";
import verificationemail from "@/emails/verificationemail"
import {ApiResponse} from "@/src/types/ApiResponse"


export async function sendverificationemail(
    email: string,
    username : string,
    verifyCode: string
): Promise<ApiResponse>{
    try{
        const resend = getResendClient()
        await resend.emails.send({
        from: "Auth <auth@sabyasachisaha.in>",
        to: email,
        subject: 'Mystry message | Verification code',
        react: verificationemail({username,otp:verifyCode})
    });
        return {success: true,message:'Verifiaction email send successfully'}
    }catch(emailError){
        console.error("Error sending verification email",emailError)
        return {success: false,message: 'Failed to send verification email'}
    }
}