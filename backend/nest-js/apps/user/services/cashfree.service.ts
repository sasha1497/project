import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CashfreeService {
  private clientId: string;
  private clientSecret: string;
  private env: 'sandbox' | 'production';
  private baseUrl: string;

  constructor(private config: ConfigService) {
    this.clientId = this.config.get<string>('CASHFREE_APP_ID')!;
    this.clientSecret = this.config.get<string>('CASHFREE_SECRET_KEY')!;
    this.env =
      this.config.get<string>('CASHFREE_ENV') === 'PRODUCTION'
        ? 'production'
        : 'sandbox';

    this.baseUrl =
      this.env === 'production'
        ? 'https://api.cashfree.com/pg/orders'
        : 'https://sandbox.cashfree.com/pg/orders';
  }

  /**
   * Create a Cashfree order
   */
  async createOrder(
    amount: number,
    currency = 'INR',
    receipt?: string,
    customerEmail?: string,
    customerPhone?: string,
  ) {
    try {
      const customerDetails: any = {
        customer_id: `cust_${Date.now()}`,
      };

      // Add optional fields ONLY if provided
      if (customerEmail) {
        customerDetails.customer_email = customerEmail;
      }

      if (customerPhone) {
        customerDetails.customer_phone = customerPhone;
      }

      const orderRequest = {
        order_amount: amount,
        order_currency: currency,
        order_id: receipt || `order_${Date.now()}`,
        customer_details: customerDetails,
      };

      const headers = {
        'Content-Type': 'application/json',
        'x-client-id': this.clientId,
        'x-client-secret': this.clientSecret,
        'x-api-version': '2022-09-01',
      };

      const response = await axios.post(this.baseUrl, orderRequest, { headers });

      return response.data;
    } catch (error: any) {
      console.error(
        'Cashfree order creation failed:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException('Failed to create Cashfree order');
    }
  }
}
