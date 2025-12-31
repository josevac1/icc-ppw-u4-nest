import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '../models/product.models';
import { PartialUpdateProductDto } from '../dtos/partial-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    return (await this.repo.find({ where: { deleted: false } }))
      .map((entity) => Product.fromEntity(entity))
      .map((product) => product.toResponseDto());
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const entity = await this.repo.findOne({ where: { id, deleted: false } });
    if (!entity) throw new NotFoundException(`Product with ID ${id} not found`);
    return Product.fromEntity(entity).toResponseDto();
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const saved = await this.repo.save(Product.fromDto(dto).toEntity());
    return Product.fromEntity(saved).toResponseDto();
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.repo.findOne({ where: { id, deleted: false } });
    if (!entity) throw new NotFoundException(`Product with ID ${id} not found`);

    const saved = await this.repo.save(
      Product.fromEntity(entity).update(dto).toEntity(),
    );

    return Product.fromEntity(saved).toResponseDto();
  }

  async partialUpdate(
    id: number,
    dto: PartialUpdateProductDto,
  ): Promise<ProductResponseDto> {
    const entity = await this.repo.findOne({ where: { id, deleted: false } });
    if (!entity) throw new NotFoundException(`Product with ID ${id} not found`);

    const saved = await this.repo.save(
      Product.fromEntity(entity).partialUpdate(dto).toEntity(),
    );

    return Product.fromEntity(saved).toResponseDto();
  }

  async delete(id: number): Promise<{ message: string }> {
    const entity = await this.repo.findOne({ where: { id, deleted: false } });
    if (!entity) throw new NotFoundException(`Product with ID ${id} not found`);

    entity.deleted = true;
    await this.repo.save(entity);

    return { message: 'Product deleted successfully' };
  }
}
