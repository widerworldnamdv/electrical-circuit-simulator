import type { Circuit } from '../models/Circuit';
import { EventBus } from './EventBus';
import { Simulator } from '../simulation/Simulator';

export class CircuitEngine {
  private readonly simulator = new Simulator();
  readonly events = new EventBus();

  simulate(circuit: Circuit): Circuit {
    const result = this.simulator.run(circuit);
    this.events.emit('simulation:completed', result);
    return result;
  }
}
