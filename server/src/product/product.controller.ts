import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CookieAuthenticationGuard } from 'src/auth/guards/coockie.guard';
import { ProductService } from './product.service';
import RequestWithSession from 'src/auth/interfaces/req-with-session.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('product')
@Controller('product')
@ApiCookieAuth()
@UseGuards(CookieAuthenticationGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Req() request: RequestWithSession,
    @Body() dto: CreateProductDto,
  ) {
    return await this.productService.createProduct(dto, request.user.id);
  }

  @Get()
  async getMyProducts(@Req() request: RequestWithSession) {
    return await this.productService.getAllProducts(request.user.id);
  }

  @Get('/:id')
  async getMyOneProduct(
    @Req() request: RequestWithSession,
    @Param('id') id: string,
  ) {
    return await this.productService.getOneProduct(id, request.user.id);
  }

  @Delete('/:id')
  async deleteProduct(
    @Req() request: RequestWithSession,
    @Param('id') id: string,
  ) {
    return await this.productService.deleteProduct(id, request.user.id);
  }

  @Patch('/:id')
  async updateProduct(
    @Req() request: RequestWithSession,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, request.user.id, dto);
  }
}
