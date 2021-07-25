export default interface TokenService {
  generateAccess(userId: number): Promise<string>
  generateRefresh(token: string): Promise<string>
  validate(token: string): Promise<number>
}
