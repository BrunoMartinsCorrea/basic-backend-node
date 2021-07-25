import { Token } from '@entity/token';

export default interface AuthenticationService {
  signIn(email: string, password: string): Promise<Token>
  validate(token: string): Promise<number>
  refresh(token: string): Promise<Token>
  signOut(token: string): Promise<void>
}
