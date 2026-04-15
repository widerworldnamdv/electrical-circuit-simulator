import { GraphBuilder } from './GraphBuilder';
import type { Circuit } from '../models/Circuit';

interface PowerInjection {
  sourcePinId: string;
}

export class SignalEngine {
  propagate(circuit: Circuit, injections: PowerInjection[]) {
    const graph = GraphBuilder.build(circuit);
    const poweredPins = new Set<string>();
    const poweredWires = new Set<string>();
    const queue: string[] = [];

    injections.forEach(({ sourcePinId }) => {
      poweredPins.add(sourcePinId);
      queue.push(sourcePinId);
    });

    while (queue.length > 0) {
      const pinId = queue.shift()!;
      const node = graph.get(pinId);
      if (!node) continue;

      node.edges.forEach((edge) => {
        poweredWires.add(edge.wireId);
        if (!poweredPins.has(edge.to)) {
          poweredPins.add(edge.to);
          queue.push(edge.to);
        }
      });
    }

    return { poweredPins, poweredWires };
  }
}
