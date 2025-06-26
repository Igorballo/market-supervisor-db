import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Cron } from './cron.entity';

export enum CompanyRole {
  COMPANY = 'company',
  ADMIN = 'admin',
}

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  country: string;

  @Column()
  sector: string;

  @Column({
    type: 'enum',
    enum: CompanyRole,
    default: CompanyRole.COMPANY,
  })
  role: CompanyRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @OneToMany(() => Cron, (cron) => cron.company)
  crons: Cron[];

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  telephone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 