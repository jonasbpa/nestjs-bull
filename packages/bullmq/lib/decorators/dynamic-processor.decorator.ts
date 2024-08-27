import { SetMetadata } from '@nestjs/common';
import { DYNAMIC_PROCESSOR_METADATA } from '../bull.constants';

/**
 * Represents a dynamic processor that is able to process jobs from multiple queues.
 */
export function DynamicProcessor(): ClassDecorator {
  return (target: Function) => {
    SetMetadata(DYNAMIC_PROCESSOR_METADATA, {})(target);
  };
}
