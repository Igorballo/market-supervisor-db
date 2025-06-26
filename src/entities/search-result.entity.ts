import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cron } from './cron.entity';

@Entity('search_results')
export class SearchResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  summary: string;

  @Column()
  url: string;

  @Column()
  source: string;

  @Column({ type: 'timestamp' })
  searchDate: Date;

  @ManyToOne(() => Cron, (cron) => cron.searchResults)
  @JoinColumn({ name: 'cronId' })
  cron: Cron;

  @Column()
  cronId: string;

  @CreateDateColumn()
  createdAt: Date;
} 