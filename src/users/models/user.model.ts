import { UserEntity } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { PartialUpdateUserDto } from '../dtos/partial-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';

export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public createdAt: Date,
  ) {}

  // ==================== FACTORY METHODS ====================

  /**
   * Crea un User desde un DTO de creación
   */
  static fromDto(dto: CreateUserDto): User {
    return new User(
      0, // El ID se asigna en BD
      dto.name,
      dto.email,
      dto.password, // Aquí se cifraría en un caso real
      new Date(),
    );
  }

  /**
   * Crea un User desde una entidad persistente
   */
  static fromEntity(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.createdAt,
    );
  }

  // ==================== CONVERSION METHODS ====================

  /**
   * Convierte este User a una entidad persistente
   */
  toEntity(): UserEntity {
    const entity = new UserEntity();
    if (this.id > 0) {
      entity.id = this.id;
    }
    entity.name = this.name;
    entity.email = this.email;
    entity.password = this.password;
    return entity;
  }

  /**
   * Convierte este User a un DTO de respuesta
   */
  toResponseDto(): UserResponseDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
    };
    // NO incluye password
  }

  /**
   * Aplica actualización completa
   */
  update(dto: UpdateUserDto): User {
    this.name = dto.name;
    this.email = dto.email;
    if (dto.password) {
      this.password = dto.password;
    }
    return this;
  }

  /**
   * Aplica actualización parcial
   */
  partialUpdate(dto: PartialUpdateUserDto): User {
    if (dto.name !== undefined) {
      this.name = dto.name;
    }
    if (dto.email !== undefined) {
      this.email = dto.email;
    }
    if (dto.password !== undefined) {
      this.password = dto.password;
    }
    return this;
  }
}
