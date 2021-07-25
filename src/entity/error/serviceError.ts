import ServiceRule from './serviceRule';

export default class ServiceError extends Error {
  constructor(readonly rule: ServiceRule, message: string) {
    super(message);
  }
}
