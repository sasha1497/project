// import twilio from 'twilio';
// import { config } from 'dotenv';
// config(); // load .env

// // Twilio credentials from .env
// const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
// const authToken = process.env.TWILIO_AUTH_TOKEN as string;
// const twilioNumber = process.env.TWILIO_PHONE_NUMBER as string;

// const client = twilio(accountSid, authToken);

// // In-memory OTP store
// interface OTPRecord {
//     otp: string;
//     expiry: number;
// }
// const otpStore: Record<string, OTPRecord> = {};

// export class SMSService {

//     // Generate 4-digit OTP
//     private generateOTP(): string {
//         return Math.floor(1000 + Math.random() * 9000).toString();
//     }

//     /******************** SEND OTP ****************************/
//     public async sendOTP(mobile: string) {
//         const otp = this.generateOTP();
//         otpStore[mobile] = {
//             otp,
//             expiry: Date.now() + 60 * 1000, // 1 minute expiry
//         };

//         const messageText = `Your Bajol OTP is - ${otp}`;

//         try {
//             const message = await client.messages.create({
//                 body: messageText,
//                 from: twilioNumber,
//                 to: mobile,
//             });

//             console.log('OTP sent:', message.sid);
//             return { success: true, otp }; // remove otp in prod
//         } catch (err) {
//             console.error('Twilio send OTP error:', err);
//             return { success: false, message: 'Failed to send OTP' };
//         }
//     }

//     /******************** VERIFY OTP ****************************/
//     public verifyOTP(mobile: string, inputOtp: string) {
//         const record = otpStore[mobile];

//         if (!record) {
//             return { success: false, message: 'No OTP sent' };
//         }

//         if (Date.now() > record.expiry) {
//             delete otpStore[mobile];
//             return { success: false, message: 'OTP expired' };
//         }

//         if (record.otp !== inputOtp) {
//             return { success: false, message: 'Invalid OTP' };
//         }

//         // OTP verified → remove from store
//         delete otpStore[mobile];
//         return { success: true, message: 'OTP verified' };
//     }
// }

import twilio from "twilio";
import { config } from "dotenv";

config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

interface OTPRecord {
  otp: string;
  expiry: number;
}

const otpStore = new Map<string, OTPRecord>();

export class SMSService {
  private generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async sendOTP(mobile: string) {
    const otp = this.generateOTP();

    otpStore.set(mobile, {
      otp,
      expiry:
        Date.now() +
        Number(process.env.OTP_EXPIRY_SECONDS || 120) * 1000,
    });

    const messageText = `Your Bajol OTP is ${otp}. Valid for 2 minutes.`;

    try {
      const message = await client.messages.create({
        body: messageText,

        // ✅ FOR INDIA (DLT only)
        from: process.env.TWILIO_SENDER_ID,

        // ✅ FOR US / others
        // from: process.env.TWILIO_PHONE_NUMBER,

        to: mobile,
      });

      console.log("SMS sent:", message.sid);

      return { success: true, message: "OTP sent" };
    } catch (error: any) {
      console.error("Twilio Error:", {
        message: error.message,
        code: error.code,
        status: error.status,
        moreInfo: error.moreInfo,
      });

      return {
        success: false,
        message: error.message || "Failed to send OTP",
      };
    }
  }

  verifyOTP(mobile: string, otp: string) {
    const record = otpStore.get(mobile);

    if (!record) {
      return { success: false, message: "OTP not found" };
    }

    if (Date.now() > record.expiry) {
      otpStore.delete(mobile);
      return { success: false, message: "OTP expired" };
    }

    if (record.otp !== otp) {
      return { success: false, message: "Invalid OTP" };
    }

    otpStore.delete(mobile);
    return { success: true, message: "OTP verified" };
  }
}

