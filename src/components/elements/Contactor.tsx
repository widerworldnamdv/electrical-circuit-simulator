import { Group, Rect, Text, Line } from 'react-konva';
import type { CircuitComponent } from '../../models/Component';
import { PinNode } from './PinNode';

interface ContactorProps {
  component: CircuitComponent;
  selected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onPinClick: (pinId: string) => void;
}

export function Contactor({ component, selected, onSelect, onDragEnd, onPinClick }: ContactorProps) {
  const closed = Boolean(component.state.contactClosed);

  return (
    <Group
      x={component.position.x}
      y={component.position.y}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(event) => onDragEnd(event.target.x(), event.target.y())}
    >
      <Rect
        width={component.size.width}
        height={component.size.height}
        cornerRadius={10}
        fill={selected ? '#dbeafe' : '#e5e7eb'}
        stroke="#0f172a"
        strokeWidth={2}
      />
      <Text x={12} y={10} text={component.props.label} fontSize={18} fontStyle="bold" fill="#0f172a" />
      <Text x={12} y={34} text={closed ? 'CLOSED' : 'OPEN'} fontSize={14} fill={closed ? '#16a34a' : '#dc2626'} />
      <Line points={closed ? [36, 60, 94, 60] : [36, 60, 78, 48]} stroke="#0f172a" strokeWidth={4} />
      {component.pins.map((pin) => (
        <PinNode
          key={pin.id}
          x={pin.offset.x}
          y={pin.offset.y}
          powered={pin.signal}
          onClick={() => onPinClick(pin.id)}
        />
      ))}
    </Group>
  );
}
