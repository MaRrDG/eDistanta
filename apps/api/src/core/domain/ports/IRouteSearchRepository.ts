import { RouteSearch } from '@domain/entities/RouteSearch';

export interface IRouteSearchRepository {
    deleteByCriteria(fingerprint: string, startName: string, endName: string): Promise<void>;
    save(search: Partial<RouteSearch>): Promise<RouteSearch>;
    findAndCountByFingerprint(fingerprint: string, limit: number, skip: number): Promise<[RouteSearch[], number]>;
}
