import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CashfreeService {
  async createOrder(amount: number, user: any) {
    const payload = {
      order_id: "order_" + Date.now(),
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: user.id,
        customer_email: user.email,
        customer_phone: user.phone,
      },
    };

    const res = await axios.post(
      "https://api.cashfree.com/pg/orders",
      payload,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2022-09-01",
        },
      }
    );

    return res.data; // contains payment_session_id
  }
}
