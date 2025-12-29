import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PartialUpdateUserDto } from '../dtos/partial-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const entities = await this.userRepository.find();
    return entities.map((entity) => UserMapper.toResponse(entity));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return UserMapper.toResponse(entity);
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const entity = this.userRepository.create(UserMapper.toEntity(dto));
    const saved = await this.userRepository.save(entity);
    return UserMapper.toResponse(saved);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    entity.name = dto.name;
    entity.email = dto.email;
    if (dto.password !== undefined) {
      entity.password = dto.password;
    }

    const saved = await this.userRepository.save(entity);
    return UserMapper.toResponse(saved);
  }

  async partialUpdate(
    id: number,
    dto: PartialUpdateUserDto,
  ): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (dto.name !== undefined) {
      entity.name = dto.name;
    }
    if (dto.email !== undefined) {
      entity.email = dto.email;
    }
    if (dto.password !== undefined) {
      entity.password = dto.password;
    }

    const saved = await this.userRepository.save(entity);
    return UserMapper.toResponse(saved);
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
