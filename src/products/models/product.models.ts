import { CreateProductDto } from '../dtos/create-product.dto';
import { PartialUpdateProductDto } from '../dtos/partial-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductEntity } from '../entities/product.entity';

export class Product {
  constructor(
    public id: number,
    public name: string,
    public description: string | null,
    public price: number,
    public stock: number,
    public createdAt: Date,
  ) {}

  static fromDto(dto: CreateProductDto): Product {
    return new Product(
      0,
      dto.name,
      dto.description ?? null,
      dto.price,
      dto.stock ?? 0,
      new Date(),
    );
  }
  static fromEntity(entity: ProductEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      entity.description ?? null,
      Number(entity.price),
      entity.stock,
      entity.createdAt,
    );
  }
  toEntity(): ProductEntity {
    const e = new ProductEntity();
    if (this.id > 0) e.id = this.id;
    e.name = this.name;
    e.description = this.description ?? null;
    e.price = this.price.toFixed(2);
    e.stock = this.stock;
    return e;
  }

  toResponseDto(): ProductResponseDto {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price.toFixed(2),
      stock: this.stock,
      createdAt: this.createdAt ? this.createdAt.toISOString() : '',
    };
  }

  update(dto: UpdateProductDto): Product {
    this.name = dto.name;
    this.description = dto.description ?? null;
    this.price = dto.price;
    this.stock = dto.stock;
    return this;
  }

  partialUpdate(dto: PartialUpdateProductDto): Product {
    if (dto.name !== undefined) this.name = dto.name;
    if (dto.description !== undefined)
      this.description = dto.description ?? null;
    if (dto.price !== undefined) this.price = dto.price;
    if (dto.stock !== undefined) this.stock = dto.stock;
    return this;
  }
}
