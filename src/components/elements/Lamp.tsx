import { Group, Circle, Text } from 'react-konva';
import type { CircuitComponent } from '../../models/Component';
import { PinNode } from './PinNode';

interface LampProps {
  component: CircuitComponent;
  selected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onPinClick: (pinId: string) => void;
}

export function Lamp({ component, selected, onSelect, onDragEnd, onPinClick }: LampProps) {
  const on = Boolean(component.state.lampOn);

  return (
    <Group
      x={component.position.x}
      y={component.position.y}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(event) => onDragEnd(event.target.x(), event.target.y())}
    >
      <Circle
        x={component.size.width / 2}
        y={component.size.height / 2}
        radius={34}
        fill={on ? '#fde047' : '#cbd5e1'}
        stroke={selected ? '#2563eb' : '#0f172a'}
        strokeWidth={3}
        shadowBlur={on ? 18 : 0}
      />
      <Text x={21} y={component.size.height + 6} text={component.props.label} fontSize={18} fill="#0f172a" />
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
