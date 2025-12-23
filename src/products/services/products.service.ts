import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PartialUpdateProductDto } from '../dtos/partial-product.dto';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private currentId = 1;

  findAll() {
    return this.products.map((p) => ProductMapper.toResponse(p));
  }

  findOne(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) return { error: 'Product not found' };
    return ProductMapper.toResponse(product);
  }

  create(dto: CreateProductDto) {
    const entity = ProductMapper.toEntity(this.currentId++, dto);
    this.products.push(entity);
    return ProductMapper.toResponse(entity);
  }

  update(id: number, dto: UpdateProductDto) {
    const product = this.products.find((p) => p.id === id);
    if (!product) return { error: 'Product not found' };

    product.name = dto.name;
    product.description = dto.description;
    product.price = dto.price;

    return ProductMapper.toResponse(product);
  }

  partialUpdate(id: number, dto: PartialUpdateProductDto) {
    const product = this.products.find((p) => p.id === id);
    if (!product) return { error: 'Product not found' };

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;

    return ProductMapper.toResponse(product);
  }

  delete(id: number) {
    const exists = this.products.some((p) => p.id === id);
    if (!exists) return { error: 'Product not found' };

    this.products = this.products.filter((p) => p.id !== id);
    return { message: 'Deleted successfully' };
  }
}
