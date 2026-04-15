import type { Circuit } from '../models/Circuit';
import type { CircuitComponent } from '../models/Component';

export interface DeviceContext {
  circuit: Circuit;
  now: number;
  getComponentById: (componentId: string) => CircuitComponent | undefined;
  getPinSignal: (componentId: string, pinLabel: string) => boolean;
  setPinSignal: (componentId: string, pinLabel: string, signal: boolean) => void;
}

export interface DeviceLogic {
  update: (component: CircuitComponent, context: DeviceContext) => CircuitComponent;
}
