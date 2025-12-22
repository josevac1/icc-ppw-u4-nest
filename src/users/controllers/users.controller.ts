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
import { UserMapper } from '../mappers/user.mapper';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PartialUpdateUserDto } from '../dtos/partial-user.dto';
import { User } from '../entities/user.entity';

@Controller('api/users')
export class UsersController {
  private users: User[] = [];
  private currentId = 1;

  @Get()
  findAll() {
    return this.users.map((u) => UserMapper.toResponse(u));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.users.find((u) => u.id === Number(id));
    if (!user) return { error: 'User not found' };

    return UserMapper.toResponse(user);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    const entity = UserMapper.toEntity(this.currentId++, dto);
    this.users.push(entity);
    return UserMapper.toResponse(entity);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = this.users.find((u) => u.id === Number(id));
    if (!user) return { error: 'User not found' };

    user.name = dto.name;
    user.email = dto.email;

    return UserMapper.toResponse(user);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() dto: PartialUpdateUserDto) {
    const user = this.users.find((u) => u.id === Number(id));
    if (!user) return { error: 'User not found' };

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;

    return UserMapper.toResponse(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const exists = this.users.some((u) => u.id === Number(id));
    if (!exists) return { error: 'User not found' };

    this.users = this.users.filter((u) => u.id !== Number(id));
    return { message: 'Deleted successfully' };
  }
}
