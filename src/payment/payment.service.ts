import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentService extends Stripe {
  constructor() {
    super(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-08-01',
    });
  }

  async createPaymentIntent(amount: number) {
    return await this.paymentIntents.create({
      amount: amount * 100,
      currency: 'brl',
      payment_method_types: ['card', 'pix', 'boleto'],
    });
  }
}
