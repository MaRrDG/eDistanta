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

@Entity('route_searches')
export class RouteSearch {
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

    // Start location
    @Column({ type: 'varchar', length: 500 })
    @Index()
    startName!: string;

    @Column('decimal', { precision: 10, scale: 7 })
    startLat!: number;

    @Column('decimal', { precision: 10, scale: 7 })
    startLng!: number;

    // End location
    @Column({ type: 'varchar', length: 500 })
    @Index()
    endName!: string;

    @Column('decimal', { precision: 10, scale: 7 })
    endLat!: number;

    @Column('decimal', { precision: 10, scale: 7 })
    endLng!: number;

    // Waypoints (intermediate stops)
    @Column({ type: 'jsonb', nullable: true })
    waypoints?: RouteWaypoint[];

    // Route specific metrics
    @Column({ type: 'boolean', default: false })
    isRoundTrip!: boolean;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    distanceKm?: number;

    @Column({ type: 'int', nullable: true })
    estimatedTimeMins?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
