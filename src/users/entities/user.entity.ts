export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  craetedAt: Date;

  constructor(id: number, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.craetedAt = new Date();
  }
}

import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;
}
