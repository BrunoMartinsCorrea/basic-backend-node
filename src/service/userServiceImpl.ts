import UserRepository from '@entity/adapter/database/userRepository';
import UserService from '@entity/adapter/service/userService';
import { User } from '@entity/user';

export default class UserServiceImpl implements UserService {
  constructor(
    private repository: UserRepository,
  ) { }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findById(id: number): Promise<User> {
    return this.repository.findById(id);
  }

  async findByEmailAndPassword(email: string, password: string): Promise<User> {
    return this.repository.findByEmailAndPassword(email, password);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
