import { McrudService } from '@app/main/services/mcurd.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class SubscriptionService {
  constructor(private readonly mcurdService: McrudService) {}

  private isMissingProfileContactColumn(error: any) {
    return error?.code === 'ER_BAD_FIELD_ERROR' && String(error?.sqlMessage || '').includes('target_user_id');
  }

  async createPendingPayment(payload: {
    user_id: string;
    plan_id?: string | null;
    cashfree_order_id: string;
    order_amount: number;
    order_currency: string;
    payment_type?: string;
    target_user_id?: string | null;
    customer_email?: string | null;
    customer_phone?: string | null;
  }) {
    try {
      const [payment] = await this.mcurdService.create(
        'payments',
        {
          user_id: payload.user_id,
          plan_id: payload.plan_id || null,
          cashfree_order_id: payload.cashfree_order_id,
          payment_type: payload.payment_type || 'subscription',
          target_user_id: payload.target_user_id || null,
          method: 'cashfree',
          status: 1,
          amount: payload.order_amount,
          currency: payload.order_currency,
          email: payload.customer_email || null,
          contact: payload.customer_phone || null,
          captured: false,
        },
        'id'
      );

      return payment;
    } catch (error: any) {
      if (this.isMissingProfileContactColumn(error)) {
        throw new InternalServerErrorException(
          'Database migration required: run sqls/init/alter-payments-profile-contact.sql to add target_user_id, payment_type, and cashfree_order_id columns to payments.'
        );
      }
      throw error;
    }
  }

  async markPaymentCaptured(cashfreeOrderId: string) {
    try {
      await this.mcurdService.update(
        'payments',
        {
          status: 2,
          captured: 1,
        },
        { cashfree_order_id: cashfreeOrderId }
      );

      return this.mcurdService.get('*', 'payments', { cashfree_order_id: cashfreeOrderId });
    } catch (error: any) {
      if (this.isMissingProfileContactColumn(error)) {
        throw new InternalServerErrorException(
          'Database migration required: run sqls/init/alter-payments-profile-contact.sql to add target_user_id, payment_type, and cashfree_order_id columns to payments.'
        );
      }
      throw error;
    }
  }

  async getPaymentByCashfreeOrderId(cashfreeOrderId: string) {
    return this.mcurdService.get('*', 'payments', { cashfree_order_id: cashfreeOrderId });
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
