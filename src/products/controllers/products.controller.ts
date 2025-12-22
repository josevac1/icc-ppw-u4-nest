import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProductMapper } from '../mappers/product.mapper';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PartialUpdateProductDto } from '../dtos/partial-product.dto';
import { Product } from '../entities/product.entity';

@Controller('api/products')
export class ProductsController {
  private products: Product[] = [];
  private currentId = 1;

  @Get()
  findAll() {
    return this.products.map((p) => ProductMapper.toResponse(p));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const product = this.products.find((p) => p.id === Number(id));
    if (!product) return { error: 'Product not found' };

    return ProductMapper.toResponse(product);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    const entity = ProductMapper.toEntity(this.currentId++, dto);
    this.products.push(entity);
    return ProductMapper.toResponse(entity);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const product = this.products.find((p) => p.id === Number(id));
    if (!product) return { error: 'Product not found' };

    product.name = dto.name;
    product.description = dto.description;
    product.price = dto.price;

    return ProductMapper.toResponse(product);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() dto: PartialUpdateProductDto) {
    const product = this.products.find((p) => p.id === Number(id));
    if (!product) return { error: 'Product not found' };

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;

    return ProductMapper.toResponse(product);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const exists = this.products.some((p) => p.id === Number(id));
    if (!exists) return { error: 'Product not found' };

    this.products = this.products.filter((p) => p.id !== Number(id));
    return { message: 'Deleted successfully' };
  }
}
