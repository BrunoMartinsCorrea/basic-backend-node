import TokenRepository from '@entity/adapter/database/tokenRepository';
import AuthenticationService from '@entity/adapter/service/authenticationService';
import TokenService from '@entity/adapter/service/tokenService';
import UserService from '@entity/adapter/service/userService';
import ServiceError from '@entity/error/serviceError';
import ServiceRule from '@entity/error/serviceRule';
import { Token } from '@entity/token';

export default class AuthenticationServiceImpl implements AuthenticationService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private tokenRepository: TokenRepository,
  ) { }

  async signIn(email: string, password: string): Promise<Token> {
    try {
      const user = await this.userService.findByEmailAndPassword(email, password);

      return await this.generateNewToken(user.id!);
    } catch (error) {
      throw new ServiceError(ServiceRule.UNAUTHORIZED, 'Email or password are incorrect!');
    }
  }

  async validate(token: string): Promise<number> {
    try {
      return await this.tokenService.validate(token);
    } catch (error) {
      throw new ServiceError(ServiceRule.UNAUTHORIZED, 'Invalid or expired token!');
    }
  }

  async refresh(token: string): Promise<Token> {
    try {
      const userId = await this.validate(token);

      return await this.generateNewToken(userId!);
    } catch (error) {
      throw new ServiceError(ServiceRule.UNAUTHORIZED, 'Invalid or expired token!');
    }
  }

  async signOut(token: string): Promise<void> {
    try {
      const userId = await this.tokenService.validate(token);
      await this.tokenRepository.deleteByUserId(userId);
    } catch (error) {
      throw new ServiceError(ServiceRule.UNAUTHORIZED, 'Invalid or expired token!');
    }
  }

  private async generateNewToken(userId: number): Promise<Token> {
    let token = await this.tokenRepository.findByUserId(userId);
    const access = await this.tokenService.generateAccess(userId);
    const refresh = await this.tokenService.generateRefresh(access);

    if (token) {
      token.access = access;
      token.refresh = refresh;
    } else {
      token = {
        userId,
        access,
        refresh,
      };
    }

    return this.tokenRepository.save(token);
  }
}
