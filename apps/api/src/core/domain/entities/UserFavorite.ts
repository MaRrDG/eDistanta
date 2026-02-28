import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export interface RouteWaypoint {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
}

/**
 * @openapi
 * components:
 *   schemas:
 *     RouteWaypoint:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - coordinates
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           minItems: 2
 *           maxItems: 2
 *           description: "[latitude, longitude]"
 *     UserFavorite:
 *       type: object
 *       required:
 *         - fingerprint
 *         - startName
 *         - startLat
 *         - startLng
 *         - endName
 *         - endLat
 *         - endLng
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         fingerprint:
 *           type: string
 *         name:
 *           type: string
 *         startName:
 *           type: string
 *         startLat:
 *           type: number
 *         startLng:
 *           type: number
 *         endName:
 *           type: string
 *         endLat:
 *           type: number
 *         endLng:
 *           type: number
 *         waypoints:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RouteWaypoint'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
@Entity('user_favorites')
export class UserFavorite {
  @PrimaryColumn('uuid')
  id!: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  @Column({ type: 'varchar', length: 255 })
  @Index()
  fingerprint!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  // Start location
  @Column({ type: 'varchar', length: 500 })
  startName!: string;

  @Column('decimal', { precision: 10, scale: 7 })
  startLat!: number;

  @Column('decimal', { precision: 10, scale: 7 })
  startLng!: number;

  // End location
  @Column({ type: 'varchar', length: 500 })
  endName!: string;

  @Column('decimal', { precision: 10, scale: 7 })
  endLat!: number;

  @Column('decimal', { precision: 10, scale: 7 })
  endLng!: number;

  // Waypoints (intermediate stops)
  @Column({ type: 'jsonb', nullable: true })
  waypoints?: RouteWaypoint[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
