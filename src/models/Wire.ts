export interface Wire {
  id: string;
  from: string;
  to: string;
  signalType: 'power' | 'control';
  signal: boolean;
}
