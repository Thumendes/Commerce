import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserParams) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserParams>,
  ) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }

  @Put(':userId/products/:productId/:action/:quantity?')
  async addProductToUser(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Param('action') action: string,
    @Param('quantity') quantity = '1',
  ) {
    if (action === 'add') {
      return await this.usersService.addProductToUser(
        +userId,
        +productId,
        +quantity,
      );
    }

    if (action === 'remove' || action === 'delete') {
      return await this.usersService.removeProductFromUser(
        +userId,
        +productId,
        +quantity,
      );
    }

    throw new HttpException('Invalid action', 400);
  }

  @Get(':userId/cart')
  async getCart(@Param('userId') userId: string) {
    return await this.usersService.getCart(+userId);
  }

  @Post(':userId/order')
  async createOrder(@Param('userId') userId: string) {
    return await this.usersService.createOrder(+userId);
  }
}
