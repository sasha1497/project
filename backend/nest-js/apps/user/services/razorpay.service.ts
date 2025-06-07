import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private razorpay: any; // Use `any` since there's no official type

  constructor(private configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });

    
  }

  async createOrder(amount: number, currency = 'INR', receipt?: string) {
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    return await this.razorpay.orders.create(options);
  }

  async verifySignature(body: string, razorpaySignature: string, secret: string): Promise<boolean> {
    const crypto = await import('crypto');
    const generatedSignature = crypto.createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    return generatedSignature === razorpaySignature;
  }
  
}
