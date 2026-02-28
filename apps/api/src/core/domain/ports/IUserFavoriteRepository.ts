import { UserFavorite } from '@domain/entities/UserFavorite';

export interface IUserFavoriteRepository {
  save(favorite: Partial<UserFavorite>): Promise<UserFavorite>;
  findByFingerprint(fingerprint: string): Promise<UserFavorite[]>;
  findByIdAndFingerprint(id: string, fingerprint: string): Promise<UserFavorite | null>;
  remove(favorite: UserFavorite): Promise<void>;
}
