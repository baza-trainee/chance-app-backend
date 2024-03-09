import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { Product } from './model/product.model';

@Module({
  imports: [TypegooseModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
