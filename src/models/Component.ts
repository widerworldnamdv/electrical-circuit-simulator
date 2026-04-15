import type { Pin } from './Pin';

export type ComponentType =
  | 'powerSource'
  | 'switch'
  | 'lamp'
  | 'contactor'
  | 'relay'
  | 'timer';

export interface ComponentPosition {
  x: number;
  y: number;
}

export interface ComponentSize {
  width: number;
  height: number;
}

export interface ComponentState {
  active?: boolean;
  latched?: boolean;
  coilEnergized?: boolean;
  contactClosed?: boolean;
  lampOn?: boolean;
  timerRunning?: boolean;
  timerElapsed?: boolean;
  lastTriggeredAt?: number | null;
  [key: string]: string | number | boolean | null | undefined;
}

export interface ComponentProps {
  label: string;
  delayMs?: number;
  normallyClosed?: boolean;
  holdTargetId?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  position: ComponentPosition;
  size: ComponentSize;
  pins: Pin[];
  props: ComponentProps;
  state: ComponentState;
}
