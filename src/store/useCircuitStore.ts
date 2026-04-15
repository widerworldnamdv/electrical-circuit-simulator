import { create } from 'zustand';
import type { CircuitComponent, ComponentType } from '../models/Component';
import type { Wire } from '../models/Wire';
import { CircuitEngine } from '../core/CircuitEngine';
import { createComponent, createDemoCircuit, createWire } from '../lib/factories';

const engine = new CircuitEngine();

interface PendingWire {
  fromPinId: string;
}

interface CircuitStore {
  components: CircuitComponent[];
  wires: Wire[];
  selectedComponentId: string | null;
  pendingWire: PendingWire | null;
  runCount: number;
  addComponent: (type: ComponentType) => void;
  moveComponent: (componentId: string, position: { x: number; y: number }) => void;
  selectComponent: (componentId: string | null) => void;
  toggleSwitch: (componentId: string) => void;
  updateComponentProps: (componentId: string, patch: Record<string, string | number | boolean>) => void;
  startWire: (fromPinId: string) => void;
  finishWire: (toPinId: string) => void;
  cancelWire: () => void;
  runSimulation: () => void;
  resetCircuit: () => void;
}

const initial = createDemoCircuit();

export const useCircuitStore = create<CircuitStore>((set, get) => ({
  components: initial.components,
  wires: initial.wires,
  selectedComponentId: null,
  pendingWire: null,
  runCount: 0,
  addComponent: (type) =>
    set((state) => ({
      components: [
        ...state.components,
        createComponent(type, {
          x: 90 + state.components.length * 28,
          y: 60 + (state.components.length % 4) * 85,
        }),
      ],
    })),
  moveComponent: (componentId, position) =>
    set((state) => ({
      components: state.components.map((component) =>
        component.id === componentId ? { ...component, position } : component,
      ),
    })),
  selectComponent: (componentId) => set({ selectedComponentId: componentId }),
  toggleSwitch: (componentId) =>
    set((state) => ({
      components: state.components.map((component) =>
        component.id === componentId && component.type === 'switch'
          ? {
              ...component,
              state: {
                ...component.state,
                active: !component.state.active,
              },
            }
          : component,
      ),
    })),
  updateComponentProps: (componentId, patch) =>
    set((state) => ({
      components: state.components.map((component) =>
        component.id === componentId
          ? {
              ...component,
              props: {
                ...component.props,
                ...patch,
              },
            }
          : component,
      ),
    })),
  startWire: (fromPinId) => set({ pendingWire: { fromPinId } }),
  finishWire: (toPinId) =>
    set((state) => {
      if (!state.pendingWire || state.pendingWire.fromPinId === toPinId) return {};
      return {
        wires: [...state.wires, createWire(state.pendingWire.fromPinId, toPinId)],
        pendingWire: null,
      };
    }),
  cancelWire: () => set({ pendingWire: null }),
  runSimulation: () => {
    const { components, wires } = get();
    const result = engine.simulate({ components, wires });
    set({ components: result.components, wires: result.wires, runCount: get().runCount + 1 });
  },
  resetCircuit: () => {
    const demo = createDemoCircuit();
    set({
      components: demo.components,
      wires: demo.wires,
      selectedComponentId: null,
      pendingWire: null,
      runCount: 0,
    });
  },
}));
