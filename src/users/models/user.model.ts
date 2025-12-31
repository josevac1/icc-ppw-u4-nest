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
  ) {
    this.validateAndPrepare();
  }

  private validateAndPrepare(): void {
    // Validar nombre
    if (!this.name || this.name.trim().length < 3) {
      throw new Error('Nombre inválido: debe tener al menos 3 caracteres');
    }

    // Validar email
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Email inválido: debe ser un formato de email válido');
    }

    // Validar password
    if (!this.password || this.password.length < 8) {
      throw new Error('Password inválido: debe tener al menos 8 caracteres');
    }

    // Preparar datos: trim en name y email, lowercase en email
    this.name = this.name.trim();
    this.email = this.email.trim().toLowerCase();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static fromDto(dto: CreateUserDto): User {
    return new User(0, dto.name, dto.email, dto.password, new Date());
  }
  static fromEntity(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.createdAt ?? new Date(),
    );
  }
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
  toResponseDto(): UserResponseDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
    };
  }
  update(dto: UpdateUserDto): User {
    if (dto.name) {
      if (dto.name.trim().length < 3) {
        throw new Error('Nombre inválido: debe tener al menos 3 caracteres');
      }
      this.name = dto.name.trim();
    }
    if (dto.email) {
      if (!this.isValidEmail(dto.email)) {
        throw new Error('Email inválido: debe ser un formato de email válido');
      }
      this.email = dto.email.trim().toLowerCase();
    }
    if (dto.password) {
      if (dto.password.length < 8) {
        throw new Error('Password inválido: debe tener al menos 8 caracteres');
      }
      this.password = dto.password;
    }
    return this;
  }
  partialUpdate(dto: PartialUpdateUserDto): User {
    if (dto.name !== undefined) {
      if (dto.name.trim().length < 3) {
        throw new Error('Nombre inválido: debe tener al menos 3 caracteres');
      }
      this.name = dto.name.trim();
    }
    if (dto.email !== undefined) {
      if (!this.isValidEmail(dto.email)) {
        throw new Error('Email inválido: debe ser un formato de email válido');
      }
      this.email = dto.email.trim().toLowerCase();
    }
    if (dto.password !== undefined) {
      if (dto.password.length < 8) {
        throw new Error('Password inválido: debe tener al menos 8 caracteres');
      }
      this.password = dto.password;
    }
    return this;
  }
}
