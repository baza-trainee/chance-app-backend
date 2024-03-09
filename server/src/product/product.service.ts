import { InjectModel } from '@m8a/nestjs-typegoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './model/product.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: ReturnModelType<typeof Product>,
  ) {}

  async createProduct(dto: CreateProductDto, userId: string) {
    const product = await this.productModel.create({ ...dto, id: userId });
    return product;
  }

  async getAllProducts(userId: string) {
    const products = await this.productModel.find({ id: userId });
    return products;
  }

  async getOneProduct(productId: string, userId: string) {
    const product = await this.productModel.findOne({
      _id: productId,
      id: userId,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async deleteProduct(id: string, userId: string) {
    const product = await this.getOneProduct(id, userId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await product.deleteOne();
    return { message: 'Продукт успішно видалено' };
  }

  async updateProduct(
    productId: string,
    userId: string,
    dto: UpdateProductDto,
  ) {
    console.log(`dto`, dto);
    const product = await this.productModel.findOneAndUpdate(
      {
        _id: productId,
        id: userId,
      },
      dto,
      { new: true },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
