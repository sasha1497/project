import { Controller, Post, Body } from '@nestjs/common';
import { RazorpayService } from '../services/razorpay.service';
import { SubscriptionService } from '../services/subscription.service';

@Controller('razorpay')
export class RazorpayController {
  constructor(
    private readonly razorpayService: RazorpayService,
    private readonly subscriptionService: SubscriptionService
  ) { }

  @Post('create-subscription-order')
  async createSubscriptionOrder(
    @Body() body: {
      user_id: string;
      plan_id: string;
      // email: string;
      // contact: string;
      currency?: string;
      receipt?: string;
    }
  ) {
    const currency = body.currency || 'INR';

    // 1. Get the plan details (to get price)
    const [plan] = await this.subscriptionService.getPlanById(body.plan_id);
    if (!plan) throw new Error('Invalid plan selected');

    const amount = plan.price; // Assuming this is in paise

    // 2. Create Razorpay order
    const order = await this.razorpayService.createOrder(amount, currency, body.receipt);

    // 3. Insert a pending payment record (status = 1)
    const payment = await this.subscriptionService.createPendingPayment({
      user_id: body.user_id,
      plan_id: body.plan_id,
      razorpay_order_id: order.id,
      amount,
      currency,
      // email: body.email,
      // contact: body.contact
    });

    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1); // 1 month from now

    await this.subscriptionService.createUserSubscription({
      user_id: body.user_id,
      plan_id: body.plan_id,
      payment_id: payment.id, // local payment id from your earlier payment creation
      end_date: subscriptionEndDate,
    });

    return {
      razorpay_order: order,
      local_payment_id: payment.id,
    };
  }
}
