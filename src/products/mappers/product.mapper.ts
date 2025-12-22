import { CreateProductDto } from '../dtos/create-product.dto';
import { Product } from '../entities/product.entity';

export class ProductMapper {
  static toEntity(id: number, dto: CreateProductDto) {
    return new Product(id, dto.name, dto.description, dto.price, 100);
  }

  static toResponse(entity: Product) {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
    };
  }
}
