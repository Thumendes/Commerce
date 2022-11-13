import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { PaymentService } from 'src/payment/payment.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, ProductsService, PaymentService],
})
export class UsersModule {}
