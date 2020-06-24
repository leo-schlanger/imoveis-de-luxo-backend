import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import Property from '@modules/properties/infra/typeorm/entities/Property';
import User from '@modules/users/infra/typeorm/entities/User';

export type AdvertisementTypeEnum = 'purchase' | 'tenancy';

@Entity('users')
class Advertisement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  property_id: string;

  @ManyToOne(() => Property, { eager: true })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column()
  @Exclude()
  user_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  address_visible: boolean;

  @Column()
  status: boolean;

  @Column('enum', { name: 'type' })
  type: AdvertisementTypeEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Advertisement;
