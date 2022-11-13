import { HttpException, Injectable } from '@nestjs/common';
import { CartItem, Product } from '@prisma/client';
import { PaymentService } from 'src/payment/payment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';
import { CreateUserParams } from './users.controller';

interface GetCartParams {
  includeProduct: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly db: PrismaService,
    private readonly productsService: ProductsService,
    private readonly payments: PaymentService,
  ) {}

  async create(createUserDto: CreateUserParams) {
    return await this.db.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: createUserDto.password,
      },
    });
  }

  async findAll() {
    return await this.db.user.findMany();
  }

  async findOne(id: number) {
    return await this.db.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: Partial<CreateUserParams>) {
    return await this.db.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.name,
        password: updateUserDto.password,
      },
    });
  }

  async remove(id: number) {
    return await this.db.user.delete({ where: { id } });
  }

  async addProductToUser(userId: number, productId: number, quantity = 1) {
    const user = await this.findOne(userId);
    if (!user) throw new HttpException('User not found', 404);

    const product = await this.productsService.findOne(productId);
    if (!product) throw new HttpException('Product not found', 404);

    const cartItem = await this.db.cartItem.findFirst({
      where: { productId, userId },
    });

    if (cartItem) {
      return await this.db.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + quantity },
      });
    }

    return await this.db.cartItem.create({
      data: {
        productId: product.id,
        userId: user.id,
        quantity: quantity,
      },
    });
  }

  async removeProductFromUser(userId: number, productId: number, quantity = 1) {
    const user = await this.findOne(userId);
    if (!user) throw new HttpException('User not found', 404);

    const product = await this.productsService.findOne(productId);
    if (!product) throw new HttpException('Product not found', 404);

    const cartItem = await this.db.cartItem.findFirst({
      where: { productId, userId },
    });

    if (cartItem) {
      if (cartItem.quantity < quantity) {
        return await this.db.cartItem.delete({ where: { id: cartItem.id } });
      }

      return await this.db.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity - 1 },
      });
    }

    throw new HttpException('Product not in cart', 400);
  }

  async getCart(userId: number): Promise<CartItem[]>;
  async getCart(
    userId: number,
    params: { includeProduct: true },
  ): Promise<(CartItem & { product: Product })[]>;
  async getCart(userId: number, params?: GetCartParams) {
    const user = await this.findOne(userId);
    if (!user) throw new HttpException('User not found', 404);

    return await this.db.user
      .findUnique({ where: { id: userId } })
      .cart({ include: { product: params?.includeProduct || false } });
  }

  async createOrder(userId: number) {
    const user = await this.findOne(userId);
    if (!user) throw new HttpException('User not found', 404);

    const cart = await this.getCart(userId, { includeProduct: true });

    if (cart.length < 1) throw new HttpException('Cart is empty', 400);

    const amount = cart.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    const paymentIntent = await this.payments.createPaymentIntent(amount);

    const order = await this.db.order.create({
      data: { paymentIntentId: paymentIntent.id, userId: user.id },
    });

    return order;
  }
}
