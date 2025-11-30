import { McrudService } from '@app/main/services/mcurd.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionService {
  constructor(private readonly mcurdService: McrudService) {}

  async createPendingPayment(payload: {
    user_id: string;
    plan_id: string;
    cashfree_order_id: string;
    order_amount: number;
    order_currency: string;
  }) {
    const [payment] = await this.mcurdService.create(
      'payments',
      {
        user_id: payload.user_id,
        plan_id: payload.plan_id,
        cashfree_order_id: payload.cashfree_order_id,
        method: 'cashfree',
        status: 1, // pending
        amount: payload.order_amount,
        currency: payload.order_currency,
        captured: false,
      },
      'id'
    );

    return payment;
  }

  async createUserSubscription(payload: {
    user_id: string;
    plan_id: string;
    payment_id: string;
    end_date: Date;
    start_date?: Date;
    is_active?: boolean;
  }) {
    const subscriptionPayload = {
      user_id: payload.user_id,
      plan_id: payload.plan_id,
      payment_id: payload.payment_id,
      start_date: payload.start_date || new Date(),
      end_date: payload.end_date,
      is_active: payload.is_active ?? true,
    };

    const [subscription] = await this.mcurdService.create(
      'user_subscriptions',
      subscriptionPayload,
      'id'
    );

    return subscription;
  }
}
