import { Controller, Post, Body } from '@nestjs/common';
import { CashfreeService } from '../services/cashfree.service';
import { SubscriptionService } from '../services/subscription.service';
import { UserService } from '../services/user.service';

@Controller('cashfree')
export class CashfreeController {
  constructor(
    private cashfreeService: CashfreeService,
    private subscriptionService: SubscriptionService,
    private userService: UserService
  ) {}

  @Post('create-subscription-order')
  async createSubscriptionOrder(@Body() data: any) {
    const { user_id, plan_id, order_amount, order_currency, receipt, customer_email, customer_phone } = data;

    console.log("📥 Incoming request:", data);

    // 1️⃣ Create Cashfree Order
    const order = await this.cashfreeService.createOrder(order_amount, order_currency, receipt, customer_email, customer_phone);
    console.log("✅ Cashfree order created:", order);

    // 2️⃣ Save pending payment in DB
    const payment = await this.subscriptionService.createPendingPayment({
      user_id,
      plan_id,
      cashfree_order_id: order.order_id,
      order_amount,
      order_currency,
    });

    // console.log("💾 Pending payment saved:", payment);

    // 3️⃣ Create instant subscription record
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await this.subscriptionService.createUserSubscription({
      user_id,
      plan_id,
      payment_id: payment.id,
      end_date: endDate,
    });

    console.log("🎉 Subscription created!");

    return {
      success: true,
      cashfree_order: order,
      local_payment_id: payment.id,
      final_amount: { order_amount, order_currency },
    };
  }

  @Post('create-profile-access-order')
  async createProfileAccessOrder(@Body() data: any) {
    const {
      viewer_user_id,
      target_user_id,
      order_amount,
      order_currency,
      receipt,
      customer_email,
      customer_phone,
    } = data;

    const order = await this.cashfreeService.createOrder(
      order_amount,
      order_currency,
      receipt,
      customer_email,
      customer_phone
    );

    const payment = await this.subscriptionService.createPendingPayment({
      user_id: viewer_user_id,
      plan_id: null,
      cashfree_order_id: order.order_id,
      order_amount,
      order_currency,
      payment_type: 'profile_contact',
      target_user_id,
      customer_email,
      customer_phone,
    });

    return {
      success: true,
      cashfree_order: order,
      local_payment_id: payment.id,
      final_amount: { order_amount, order_currency },
    };
  }

  @Post('confirm-profile-access-order')
  async confirmProfileAccessOrder(@Body() data: any) {
    const cashfreeOrderId = String(data?.cashfree_order_id || '').trim();

    if (!cashfreeOrderId) {
      return {
        success: false,
        message: 'cashfree_order_id is required',
      };
    }

    const payment = await this.subscriptionService.markPaymentCaptured(cashfreeOrderId);

    if (!payment) {
      return {
        success: false,
        message: 'Payment not found',
      };
    }

    const unlockedProfile = await this.userService.getUserData(
      String(payment.target_user_id),
      String(payment.user_id)
    );

    return {
      success: true,
      message: 'Profile contact unlocked successfully',
      payment,
      unlockedProfile,
    };
  }
}
