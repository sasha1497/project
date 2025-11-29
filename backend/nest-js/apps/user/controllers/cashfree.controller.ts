import { Controller, Post, Body } from '@nestjs/common';
import { CashfreeService } from '../services/cashhfree.service';

@Controller('cashfree')
export class CashfreeController {
  constructor(private readonly cashfreeService: CashfreeService) {}

  @Post('order')
  createOrder(@Body() body: any) {
    return this.cashfreeService.createOrder(body.amount, body.user);
  }
}
