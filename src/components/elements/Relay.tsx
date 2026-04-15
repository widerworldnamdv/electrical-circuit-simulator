import { Group, Rect, Text, Line } from 'react-konva';
import type { CircuitComponent } from '../../models/Component';
import { PinNode } from './PinNode';

interface RelayProps {
  component: CircuitComponent;
  selected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onPinClick: (pinId: string) => void;
}

export function Relay({ component, selected, onSelect, onDragEnd, onPinClick }: RelayProps) {
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
      <Rect width={component.size.width} height={component.size.height} cornerRadius={10} fill={selected ? '#dbeafe' : '#eef2ff'} stroke="#0f172a" strokeWidth={2} />
      <Text x={12} y={10} text={component.props.label} fontSize={18} fontStyle="bold" fill="#0f172a" />
      <Text x={12} y={34} text={closed ? 'ENERGIZED' : 'IDLE'} fontSize={14} fill={closed ? '#16a34a' : '#64748b'} />
      <Line points={closed ? [28, 56, 88, 56] : [28, 56, 78, 42]} stroke="#0f172a" strokeWidth={4} />
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
