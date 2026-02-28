import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDecimal,
} from 'class-validator';

/**
 * @openapi
 * components:
 *   schemas:
 *     FuelPrice:
 *       type: object
 *       required:
 *         - stationName
 *         - fuelType
 *         - price
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the fuel price
 *         stationName:
 *           type: string
 *           description: Name of the fuel station (e.g., OMV, Petrom)
 *         fuelType:
 *           type: string
 *           description: Type of fuel (e.g., benzina-regular, motorina-standard)
 *         price:
 *           type: number
 *           format: decimal
 *           description: Price per liter
 *         currency:
 *           type: string
 *           default: RON
 *           description: Currency of the price
 *         location:
 *           type: string
 *           description: General location/city
 *         address:
 *           type: string
 *           description: Specific address of the station
 *         scrapedAt:
 *           type: string
 *           format: date-time
 *           description: When the price was scraped
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
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

  @Column({
    name: 'scraped_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  scrapedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
