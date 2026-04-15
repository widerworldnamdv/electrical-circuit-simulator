import type { CircuitComponent } from './Component';
import type { Wire } from './Wire';

export interface Circuit {
  components: CircuitComponent[];
  wires: Wire[];
}
