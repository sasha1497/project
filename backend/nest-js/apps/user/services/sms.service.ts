import twilio from 'twilio';
import { config } from 'dotenv';
config(); // load .env

// Twilio credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER as string;

const client = twilio(accountSid, authToken);

// In-memory OTP store
interface OTPRecord {
    otp: string;
    expiry: number;
}
const otpStore: Record<string, OTPRecord> = {};

export class SMSService {

    // Generate 4-digit OTP
    private generateOTP(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    /******************** SEND OTP ****************************/
    public async sendOTP(mobile: string) {
        const otp = this.generateOTP();
        otpStore[mobile] = {
            otp,
            expiry: Date.now() + 60 * 1000, // 1 minute expiry
        };

        const messageText = `Your Bajol OTP is - ${otp}`;

        try {
            const message = await client.messages.create({
                body: messageText,
                from: twilioNumber,
                to: mobile,
            });

            console.log('OTP sent:', message.sid);
            return { success: true, otp }; // remove otp in prod
        } catch (err) {
            console.error('Twilio send OTP error:', err);
            return { success: false, message: 'Failed to send OTP' };
        }
    }

    /******************** VERIFY OTP ****************************/
    public verifyOTP(mobile: string, inputOtp: string) {
        const record = otpStore[mobile];

        if (!record) {
            return { success: false, message: 'No OTP sent' };
        }

        if (Date.now() > record.expiry) {
            delete otpStore[mobile];
            return { success: false, message: 'OTP expired' };
        }

        if (record.otp !== inputOtp) {
            return { success: false, message: 'Invalid OTP' };
        }

        // OTP verified → remove from store
        delete otpStore[mobile];
        return { success: true, message: 'OTP verified' };
    }
}
