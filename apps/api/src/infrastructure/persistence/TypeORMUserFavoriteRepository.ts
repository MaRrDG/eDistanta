import { Repository } from 'typeorm';
import { UserFavorite } from '@domain/entities/UserFavorite';
import { IUserFavoriteRepository } from '@domain/ports/IUserFavoriteRepository';

export class TypeORMUserFavoriteRepository implements IUserFavoriteRepository {
    constructor(private repository: Repository<UserFavorite>) { }

    async save(favorite: Partial<UserFavorite>): Promise<UserFavorite> {
        const entity = this.repository.create(favorite);
        return await this.repository.save(entity);
    }

    async findByFingerprint(fingerprint: string): Promise<UserFavorite[]> {
        return await this.repository.find({
            where: { fingerprint },
            order: { createdAt: 'DESC' },
        });
    }

    async findByIdAndFingerprint(
        id: string,
        fingerprint: string
    ): Promise<UserFavorite | null> {
        return await this.repository.findOne({
            where: { id, fingerprint },
        });
    }

    async remove(favorite: UserFavorite): Promise<void> {
        await this.repository.remove(favorite);
    }
}
