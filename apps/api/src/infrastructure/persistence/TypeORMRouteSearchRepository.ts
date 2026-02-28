import { Repository } from 'typeorm';
import { RouteSearch } from '@domain/entities/RouteSearch';
import { IRouteSearchRepository } from '@domain/ports/IRouteSearchRepository';

export class TypeORMRouteSearchRepository implements IRouteSearchRepository {
    constructor(private repository: Repository<RouteSearch>) { }

    async deleteByCriteria(fingerprint: string, startName: string, endName: string): Promise<void> {
        await this.repository.delete({
            fingerprint,
            startName,
            endName
        });
    }

    async save(search: Partial<RouteSearch>): Promise<RouteSearch> {
        const entity = this.repository.create(search);
        return await this.repository.save(entity);
    }

    async findAndCountByFingerprint(fingerprint: string, limit: number, skip: number): Promise<[RouteSearch[], number]> {
        return await this.repository.findAndCount({
            where: { fingerprint },
            order: { createdAt: 'DESC' },
            take: limit,
            skip,
        });
    }
}
