export default interface DatabaseClientService {
  query<T>(command: string): Promise<T[]>
  execute(command: string): Promise<number>
}
