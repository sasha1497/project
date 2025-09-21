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
  async createSubscriptionOrder(
    @Body() body: {
      user_id: string;
      plan_id: string;
      country?: string;
      currency: string;   // frontend sends currency (USD, AED, INR etc.)
      amount: number;     // frontend sends correct localized price
      receipt?: string;
    }
  ) {
    // 1. Validate plan
    const [plan] = await this.subscriptionService.getPlanById(body.plan_id);
    if (!plan) throw new Error('Invalid plan selected');

    // 2. Use frontend provided amount + currency
    const amount = body.amount;
    const currency = body.currency;

    // 3. Create Razorpay order
    const order = await this.razorpayService.createOrder(amount, currency, body.receipt);

    // 4. Insert a pending payment
    const payment = await this.subscriptionService.createPendingPayment({
      user_id: body.user_id,
      plan_id: body.plan_id,
      razorpay_order_id: order.id,
      amount,
      currency,
    });

    // 5. Create subscription record
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    await this.subscriptionService.createUserSubscription({
      user_id: body.user_id,
      plan_id: body.plan_id,
      payment_id: payment.id,
      end_date: subscriptionEndDate,
    });

    return {
      razorpay_order: order,
      local_payment_id: payment.id,
      final_price: { amount, currency },
    };
  }
}
