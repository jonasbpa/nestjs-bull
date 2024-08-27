import { OnWorkerEventMetadata } from '../decorators';

export interface NestWorkerEventOptions extends OnWorkerEventMetadata {
  handler: Function;
}
