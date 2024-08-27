import { OnApplicationShutdown, Type } from '@nestjs/common';
import { Job, Worker } from 'bullmq';
import { NestWorkerOptions } from '../interfaces/worker-options.interface';
import { NestWorkerEventOptions } from '../interfaces/worker-event-options.interface';

export abstract class DynamicProcessorHost<
  T extends Worker['processFn'] = Worker['processFn'],
  X extends Worker = Worker,
> implements OnApplicationShutdown
{
  private readonly _processor: T | undefined;
  private readonly _workerClass: Type = Worker;
  private _workers: Array<X> = [];

  get processor(): T {
    if (!this._processor) {
      throw new Error(
        '"Processor" has not yet been initialized. Make sure to interact with processor instances after the "onModuleInit" lifecycle hook is triggered for example, in the "onApplicationBootstrap" hook, or if "manualRegistration" is set to true make sure to call "BullRegistrar.register()"',
      );
    }
    return this._processor;
  }

  abstract process(job: Job, token?: string): Promise<any>;

  registerWorker(
    queueName: string,
    options: NestWorkerOptions,
    eventOptions?: Array<NestWorkerEventOptions>,
  ) {
    const worker = new this._workerClass(queueName, this.processor, options);
    eventOptions?.forEach((event) => worker.on(event.eventName, event.handler));
    this._workers.push(worker);
  }

  onApplicationShutdown(signal?: string) {
    return this._workers?.map((_worker) => _worker.close());
  }
}
