import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  price: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  stock: number;
}
