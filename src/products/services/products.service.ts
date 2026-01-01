import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { ProductEntity } from '../entities/product.entity';
import { PartialUpdateProductDto } from '../dtos/partial-product.dto';
import { NotFoundException } from 'src/exceptions/domain/not-found.exception';
import { ConflictException } from 'src/exceptions/domain/conflict.exception';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.find({
      where: { deleted: false },
    });
    return entities.map((entity) => ProductMapper.toResponse(entity));
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({
      where: { id, deleted: false },
    });
    if (!entity) {
      throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    }
    return ProductMapper.toResponse(entity);
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    // Validar que el nombre no exista
    const exists = await this.productRepository.exist({
      where: { name: dto.name, deleted: false },
    });
    if (exists) {
      throw new ConflictException(`El producto ${dto.name} ya está registrado`);
    }

    const entity = this.productRepository.create(ProductMapper.toEntity(dto));
    const saved = await this.productRepository.save(entity);
    return ProductMapper.toResponse(saved);
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({
      where: { id, deleted: false },
    });
    if (!entity) {
      throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    }

    entity.name = dto.name;
    entity.description = dto.description;
    entity.price = dto.price.toFixed(2);
    entity.stock = dto.stock;

    const saved = await this.productRepository.save(entity);
    return ProductMapper.toResponse(saved);
  }

  async partialUpdate(
    id: number,
    dto: PartialUpdateProductDto,
  ): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({
      where: { id, deleted: false },
    });
    if (!entity) {
      throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    }

    if (dto.name !== undefined) {
      entity.name = dto.name;
    }
    if (dto.description !== undefined) {
      entity.description = dto.description;
    }
    if (dto.price !== undefined) {
      entity.price = dto.price.toFixed(2);
    }
    if (dto.stock !== undefined) {
      entity.stock = dto.stock;
    }

    const saved = await this.productRepository.save(entity);
    return ProductMapper.toResponse(saved);
  }

  async delete(id: number): Promise<{ message: string }> {
    const entity = await this.productRepository.findOne({
      where: { id, deleted: false },
    });
    if (!entity) {
      throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    }

    entity.deleted = true;
    await this.productRepository.save(entity);

    return { message: 'Product deleted successfully' };
  }
}
