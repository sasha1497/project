import { Controller, Post, Body } from '@nestjs/common';
import { RazorpayService } from '../services/razorpay.service';
import { SubscriptionService } from '../services/subscription.service';

@Controller('razorpay')
export class RazorpayController {
  constructor(
    private readonly razorpayService: RazorpayService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  @Post('create-subscription-order')
  async createSubscriptionOrder(@Body() data: any) {
    // Destructure incoming request
    const { user_id, plan_id, country, currency, amount, receipt } = data;

    console.log('📥 Request:', { user_id, plan_id, country, currency, amount, receipt });

    // 1. Create Razorpay order using frontend-provided amount and currency
    const order = await this.razorpayService.createOrder(amount, currency, receipt);
    console.log('✅ Razorpay order created:', order);

    // 2. Insert a pending payment in your DB
    const payment = await this.subscriptionService.createPendingPayment({
      user_id,
      plan_id,
      razorpay_order_id: order.id,
      amount,
      currency,
    });
    console.log('✅ Pending payment saved:', payment);

    // 3. Create subscription record (1 month from now)
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    await this.subscriptionService.createUserSubscription({
      user_id,
      plan_id,
      payment_id: payment.id,
      end_date: subscriptionEndDate,
    });
    console.log('✅ User subscription created');

    // 4. Return response
    return {
      razorpay_order: order,
      local_payment_id: payment.id,
      final_price: { amount, currency },
    };
  }
}
