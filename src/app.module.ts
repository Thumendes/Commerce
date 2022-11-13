import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductsModule } from './products/products.module';
import { PaymentService } from './payment/payment.service';

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [],
  providers: [PrismaService, PaymentService],
})
export class AppModule {}
