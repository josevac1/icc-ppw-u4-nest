import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private users: User[] = [];
  private currentId = 1;

  findAll() {
    return this.users.map(u => UserMapper.toResponse(u));
  }

  findOne(id: number) {
    const user = this.users.find(u => u.id === id);
    if (!user) return { error: 'User not found' };
    return UserMapper.toResponse(user);
  }

  create(dto: CreateUserDTO) {
    const entity = UserMapper.toEntity(this.currentId++, dto);
    this.users.push(entity);
    return UserMapper.toResponse(entity);
  }

  update(id: number, dto: UpdateUserDto) {
    const user = this.users.find(u => u.id === id);
    if (!user) return { error: 'User not found' };

    user.name = dto.name;
    user.email = dto.email;

    return UserMapper.toResponse(user);
  }

  partialUpdate(id: number, dto: PartialUpdateUserDto) {
    const user = this.users.find(u => u.id === id);
    if (!user) return { error: 'User not found' };

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;

    return UserMapper.toResponse(user);
  }

  delete(id: number) {
    const exists = this.users.some(u => u.id === id);
    if (!exists) return { error: 'User not found' };

    this.users = this.users.filter(u => u.id !== id);
    return { message: 'Deleted successfully' };
  }
}
