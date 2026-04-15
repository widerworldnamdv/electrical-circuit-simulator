export type PinSignalType = 'power' | 'control';
export type PinRole = 'input' | 'output';

export interface PinPosition {
  x: number;
  y: number;
}

export interface Pin {
  id: string;
  componentId: string;
  label: string;
  type: PinSignalType;
  role: PinRole;
  signal: boolean;
  offset: PinPosition;
}
