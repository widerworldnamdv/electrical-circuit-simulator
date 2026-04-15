import { Line } from 'react-konva';
import type { CircuitComponent } from '../../models/Component';
import type { Wire } from '../../models/Wire';
import { getPinAbsolutePosition } from '../../lib/geometry';

interface WireRendererProps {
  wire: Wire;
  components: CircuitComponent[];
}

export function WireRenderer({ wire, components }: WireRendererProps) {
  const fromComponent = components.find((component) => component.pins.some((pin) => pin.id === wire.from));
  const toComponent = components.find((component) => component.pins.some((pin) => pin.id === wire.to));

  if (!fromComponent || !toComponent) return null;

  const from = getPinAbsolutePosition(fromComponent, wire.from);
  const to = getPinAbsolutePosition(toComponent, wire.to);

  if (!from || !to) return null;

  return (
    <Line
      points={[from.x, from.y, (from.x + to.x) / 2, from.y, (from.x + to.x) / 2, to.y, to.x, to.y]}
      stroke={wire.signal ? '#22c55e' : '#6b7280'}
      strokeWidth={wire.signal ? 4 : 3}
      lineCap="round"
      lineJoin="round"
    />
  );
}
