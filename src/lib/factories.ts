import type { Circuit } from '../models/Circuit';
import type { CircuitComponent, ComponentType } from '../models/Component';
import type { Pin } from '../models/Pin';
import type { Wire } from '../models/Wire';

const sizeMap: Record<ComponentType, { width: number; height: number }> = {
  powerSource: { width: 110, height: 60 },
  switch: { width: 110, height: 64 },
  lamp: { width: 92, height: 92 },
  contactor: { width: 130, height: 88 },
  relay: { width: 120, height: 80 },
  timer: { width: 128, height: 82 },
};

const pin = (
  componentId: string,
  suffix: string,
  label: string,
  role: 'input' | 'output',
  offset: { x: number; y: number },
  type: 'power' | 'control' = 'power',
): Pin => ({
  id: `${componentId}-${suffix}`,
  componentId,
  label,
  role,
  type,
  signal: false,
  offset,
});

export const createComponent = (
  type: ComponentType,
  position: { x: number; y: number },
  seed = crypto.randomUUID().slice(0, 8),
): CircuitComponent => {
  const id = `${type}-${seed}`;
  const size = sizeMap[type];

  switch (type) {
    case 'powerSource':
      return {
        id,
        type,
        position,
        size,
        props: { label: '24V Source' },
        state: {},
        pins: [pin(id, 'out', 'OUT', 'output', { x: size.width, y: size.height / 2 })],
      };
    case 'switch':
      return {
        id,
        type,
        position,
        size,
        props: { label: 'Switch' },
        state: { active: false },
        pins: [
          pin(id, 'in', 'IN', 'input', { x: 0, y: size.height / 2 }),
          pin(id, 'out', 'OUT', 'output', { x: size.width, y: size.height / 2 }),
        ],
      };
    case 'lamp':
      return {
        id,
        type,
        position,
        size,
        props: { label: 'Lamp' },
        state: { lampOn: false },
        pins: [pin(id, 'in', 'IN', 'input', { x: 0, y: size.height / 2 })],
      };
    case 'contactor':
      return {
        id,
        type,
        position,
        size,
        props: { label: 'Contactor', holdTargetId: undefined },
        state: { coilEnergized: false, latched: false },
        pins: [
          pin(id, 'coil-plus', 'COIL+', 'input', { x: 0, y: 24 }),
          pin(id, 'no-out', 'NO_OUT', 'output', { x: size.width, y: 44 }),
        ],
      };
    case 'relay':
      return {
        id,
        type,
        position,
        size,
        props: { label: 'Relay', normallyClosed: false },
        state: { coilEnergized: false, contactClosed: false },
        pins: [
          pin(id, 'coil-plus', 'COIL+', 'input', { x: 0, y: 24 }),
          pin(id, 'out', 'OUT', 'output', { x: size.width, y: 40 }),
        ],
      };
    case 'timer':
      return {
        id,
        type,
        position,
        size,
        props: { label: 'Timer', delayMs: 1500 },
        state: { timerRunning: false, timerElapsed: false, lastTriggeredAt: null },
        pins: [
          pin(id, 'in', 'IN', 'input', { x: 0, y: 26 }),
          pin(id, 'out', 'OUT', 'output', { x: size.width, y: 42 }),
        ],
      };
  }
};

export const createWire = (from: string, to: string, signalType: 'power' | 'control' = 'power'): Wire => ({
  id: `wire-${crypto.randomUUID().slice(0, 8)}`,
  from,
  to,
  signalType,
  signal: false,
});

export const createDemoCircuit = (): Circuit => {
  const source = createComponent('powerSource', { x: 60, y: 170 }, 'source');
  const startSwitch = createComponent('switch', { x: 230, y: 160 }, 'start');
  startSwitch.props.label = 'Start';
  startSwitch.state.active = true;

  const contactor = createComponent('contactor', { x: 420, y: 145 }, 'k1');
  contactor.props.label = 'K1';
  contactor.props.holdTargetId = startSwitch.id;

  const timer = createComponent('timer', { x: 630, y: 150 }, 't1');
  timer.props.label = 'T1';
  timer.props.delayMs = 1000;

  const lamp = createComponent('lamp', { x: 860, y: 145 }, 'lamp');
  lamp.props.label = 'Lamp';

  return {
    components: [source, startSwitch, contactor, timer, lamp],
    wires: [
      createWire(source.pins[0].id, startSwitch.pins[0].id),
      createWire(startSwitch.pins[1].id, contactor.pins[0].id),
      createWire(contactor.pins[1].id, timer.pins[0].id),
      createWire(timer.pins[1].id, lamp.pins[0].id),
    ],
  };
};
