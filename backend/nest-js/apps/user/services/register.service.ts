import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { McrudService } from '@app/main/services/mcurd.service';
import { SMSService } from './sms.service';

const JWT_SECRET = process.env.JWT_SECRET as string;

@Injectable()
export class RegisterService {
    constructor(
        private mcurdSerRef: McrudService,
        private smsService: SMSService,
    ) { }

    private getMobileVariants(rawMobile: string): string[] {
        const input = (rawMobile || '').trim();
        const digits = input.replace(/\D/g, '');
        const local10 = digits.length >= 10 ? digits.slice(-10) : digits;

        return Array.from(
            new Set([
                input,
                digits,
                local10,
                `91${local10}`,
                `+91${local10}`,
            ].filter(Boolean)),
        );
    }

    /******************** LOGIN ****************************/
    async login(data: { mobileNumber: string; state: string; password: string }) {
        const { mobileNumber, state, password } = data;

        // Validate input
        if (!mobileNumber || !state || !password) {
            throw new BadRequestException('Mobile number, state and password are required');
        }

        // Fetch user by trying common mobile formats (+91XXXXXXXXXX / 91XXXXXXXXXX / XXXXXXXXXX)
        const stateValue = (state || '').trim();
        const mobileVariants = this.getMobileVariants(mobileNumber);
        let user: any = null;

        for (const phone of mobileVariants) {
            user = await this.mcurdSerRef.get('*', 'users', {
                phone_number: phone,
                state: stateValue,
            });
            if (user) break;
        }
        if (!user) {
            throw new UnauthorizedException('Invalid mobile number, state or password');
        }

        // Verify password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid mobile number, state or password');
        }

        // Determine gender type
        let genderType = 3;
        if (user.gender) {
            const gender = user.gender.toLowerCase();
            if (gender === 'male') genderType = 1;
            else if (gender === 'female') genderType = 2;
        }

        // Generate JWT token
        const payload = { userId: user.id, genderType };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        return {
            message: 'Login successful',
            user: {
                token, id: user.id, name: user.name, type: genderType,
            },
        };
    }

    /******************** SEND OTP ****************************/
    async sendOtp(data: { mobileNumber: string }) {
        const result = await this.smsService.sendOTP(data.mobileNumber);
        if (result.success) return { success: true, message: 'OTP sent successfully' };
        return { success: false, message: 'Failed to send OTP' };
    }

    /******************** VERIFY OTP ****************************/
    verifyOtp(data: { mobileNumber: string; otp: string }) {
        return this.smsService.verifyOTP(data.mobileNumber, data.otp);
    }

    /******************** RESET PASSWORD ****************************/
    async resetPassword(data) {
        const { password, confirm_password, mobileNumber } = data;

        // 1. Validate passwords
        if (!password || !confirm_password) {
            throw new Error('Password and confirm password are required');
        }

        if (password !== confirm_password) {
            throw new Error('Password and confirm password do not match');
        }

        // 2. Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Update DB
        const result = await this.mcurdSerRef.update(
            'users',
            { password: hashedPassword, confirmPassword: hashedPassword },
            { phone_number: mobileNumber }
        );

        if (result.affectedRows === 0) {
            throw new Error('User not found or password update failed');
        }

        return {
            "success": true,
            "toast": {
                "type": "success",
                "title": "Password Changed",
                "message": "Your password was updated successfully. Please log in with your new password."
            }

        };
    }

}
