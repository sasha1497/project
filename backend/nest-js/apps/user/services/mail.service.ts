import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: '', 
                pass: '', 
            },
        });
    }

    async sendUserCreationMail(to: string, username: string) {
        // Path to the image in backend project
       const logoPath = join(process.cwd(), 'src', 'assets', 'bajollogo.jpeg');


        await this.transporter.sendMail({
            from: `"akashlikely348@gmail.com"`,
            to : [to, "akashlikely348@gmail.com"],
            subject: '🎉 User Created Successfully!',
            html: `
                        <div style="font-family: Arial, sans-serif; text-align: center;">
                        <img src="cid:logo" style="width:150px; height:auto; margin-bottom:20px;" />
                        <h2>Hi ${username},</h2>
                        <p>Your BAJOL account has been created successfully.</p>
                        <p>Welcome to our platform 🚀</p>
                        </div>
                    `,
            attachments: [
                {
                    filename: 'bajollogo.jpeg',
                    path: logoPath,
                    cid: 'logo', 
                },
            ],
        });
    }
}

