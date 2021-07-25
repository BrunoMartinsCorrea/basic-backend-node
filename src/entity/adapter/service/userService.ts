import { User } from '@entity/user';

export default interface UserService {
  save(user: User): Promise<User>
  findById(id: number): Promise<User>
  findByEmailAndPassword(email: string, password: string): Promise<User>
  delete(id: number): Promise<void>
}
