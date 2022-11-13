import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductParams } from './products.controller';

@Injectable()
export class ProductsService {
  constructor(private readonly db: PrismaService) {}

  async create(createProductDto: CreateProductParams) {
    return await this.db.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
      },
    });
  }

  async findAll() {
    return await this.db.product.findMany();
  }

  async findOne(id: number) {
    return await this.db.product.findUnique({ where: { id } });
  }

  async update(id: number, updateProductDto: Partial<CreateProductParams>) {
    return await this.db.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        price: updateProductDto.price,
      },
    });
  }

  async remove(id: number) {
    return await this.db.product.delete({ where: { id } });
  }
}
