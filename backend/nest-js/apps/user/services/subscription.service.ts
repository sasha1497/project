import { Injectable } from '@nestjs/common';
import { McrudService } from 'libs/services/src/mcurd.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly mcurdService: McrudService) { }

  async getPlanById(plan_id: string) {
    return this.mcurdService.find('payment_plans', { id: plan_id });
  }
  async createPendingPayment(payload: {
    user_id: string;
    plan_id: string;
    razorpay_order_id: string;
    amount: number;
    currency: string;
    // email: string;
    // contact: string;
  }) {
    const [payment] = await this.mcurdService.create('payments', {
      user_id: payload.user_id,
      plan_id: payload.plan_id,
      razorpay_payment_id: payload.razorpay_order_id, 
      method: 'razorpay',
      status: 1, // pending
      amount: payload.amount,
      currency: payload.currency,
      // email: payload.email,
      // contact: payload.contact,
      captured: false,
      country_code: 'IN'
    }, 'id');

    return payment;
  }

  async createUserSubscription(payload: {
  user_id: string;
  plan_id: string;
  payment_id: string; // local payment ID
  start_date?: Date;
  end_date: Date; // must be provided
  is_active?: boolean;
}) {
  const subscriptionPayload = {
    user_id: payload.user_id,
    plan_id: payload.plan_id,
    payment_id: payload.payment_id,
    start_date: payload.start_date || new Date(),
    end_date: payload.end_date,
    is_active: payload.is_active !== undefined ? payload.is_active : true,
  };

  const [subscription] = await this.mcurdService.create('user_subscriptions', subscriptionPayload, 'id');
  return subscription;
}


}
