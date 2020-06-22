import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Address from '@modules/adresses/infra/typeorm/entities/Address';
import { Exclude } from 'class-transformer';

export type PropertyTypeEnum =
  | 'casa'
  | 'apartamento'
  | 'cobertura'
  | 'sitio'
  | 'fazenda'
  | 'terreno'
  | 'galpão'
  | 'corporativo'
  | 'escritorio'
  | 'loja'
  | 'hotel'
  | 'pousada'
  | 'ilha'
  | 'customizado';

@Entity('properties')
class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  address_id: string;

  @ManyToOne(() => Address, { eager: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column('enum', { name: 'type' })
  type: PropertyTypeEnum;

  @Column('decimal', { scale: 2 })
  value: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Property;
