import TokenService from '@entity/adapter/service/tokenService';
import jwt, { Jwt, SignOptions, VerifyOptions } from 'jsonwebtoken';

export default class TokenServiceImpl implements TokenService {
  private secretKey = 'catchau';

  private accessExpirationInHours = 30;

  private refreshExpirationInHours = 30;

  async generateAccess(userId: number): Promise<string> {
    const options: SignOptions = {
      issuer: 'backend',
      audience: 'backend',
      subject: userId.toString(),
      expiresIn: this.accessExpirationInHours,
      algorithm: 'HS256',
    };

    return jwt.sign({}, this.secretKey, options);
  }

  async generateRefresh(token: string): Promise<string> {
    const jwtConfig = await TokenServiceImpl.getPayload(token);
    const options: SignOptions = {
      issuer: jwtConfig.payload.iss,
      audience: jwtConfig.payload.aud,
      subject: jwtConfig.payload.sub,
      expiresIn: this.accessExpirationInHours + this.refreshExpirationInHours,
      notBefore: this.accessExpirationInHours,
      algorithm: jwtConfig.header.alg as jwt.Algorithm,
    };

    return jwt.sign({}, this.secretKey, options);
  }

  async validate(token: string): Promise<number> {
    try {
      const options: VerifyOptions = {
        issuer: 'backend',
        audience: 'backend',
        algorithms: ['HS256'],
        complete: false,
        ignoreExpiration: false,
      };

      const payload = jwt.verify(token, this.secretKey, options);

      return Number(payload.sub);
    } catch (error) {
      throw new Error('Invalid or expired token!');
    }
  }

  static async getPayload(token: string): Promise<Jwt> {
    return jwt.decode(token, { complete: true, json: true })!;
  }
}
