export default interface MigrationService {
  migrate(): Promise<void>
}
