import type { CircuitComponent } from '../models/Component';

export const getPinAbsolutePosition = (
  component: CircuitComponent,
  pinId: string,
): { x: number; y: number } | null => {
  const pin = component.pins.find((item) => item.id === pinId);
  if (!pin) return null;
  return {
    x: component.position.x + pin.offset.x,
    y: component.position.y + pin.offset.y,
  };
};
