import type { Circuit } from '../models/Circuit';
import type { Wire } from '../models/Wire';

export interface GraphNode {
  pinId: string;
  edges: GraphEdge[];
}

export interface GraphEdge {
  to: string;
  wireId: string;
}

export type CircuitGraph = Map<string, GraphNode>;

export class GraphBuilder {
  static build(circuit: Circuit): CircuitGraph {
    const graph: CircuitGraph = new Map();

    const ensureNode = (pinId: string) => {
      if (!graph.has(pinId)) {
        graph.set(pinId, { pinId, edges: [] });
      }
      return graph.get(pinId)!;
    };

    circuit.components.forEach((component) => {
      component.pins.forEach((pin) => ensureNode(pin.id));
    });

    circuit.wires.forEach((wire: Wire) => {
      ensureNode(wire.from).edges.push({ to: wire.to, wireId: wire.id });
      ensureNode(wire.to).edges.push({ to: wire.from, wireId: wire.id });
    });

    return graph;
  }
}
