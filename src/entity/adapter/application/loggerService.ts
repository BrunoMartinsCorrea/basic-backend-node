export default interface LoggerService {
  info(message: string): void
  error(message: string): void
}
