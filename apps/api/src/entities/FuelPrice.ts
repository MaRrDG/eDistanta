import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDecimal } from 'class-validator';

@Entity('fuel_prices')
@Index(['stationName', 'fuelType'])
@Index(['scrapedAt'])
@Index(['location'])
export class FuelPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'station_name', type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  stationName: string;

  @Column({ name: 'fuel_type', type: 'varchar', length: 50 })
  @IsNotEmpty()
  @IsString()
  fuelType: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Column({ type: 'varchar', length: 3, default: 'RON' })
  @IsOptional()
  @IsString()
  currency: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Column({ name: 'scraped_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  scrapedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
} 