import { Token } from '@entity/token';

export default interface TokenRepository {
  save(token: Token): Promise<Token>
  findById(id: number): Promise<Token | undefined>
  findByUserId(userId: number): Promise<Token | undefined>
  deleteByUserId(userId: number): Promise<void>
}
