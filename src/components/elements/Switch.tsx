import { Group, Rect, Text, Line } from 'react-konva';
import type { CircuitComponent } from '../../models/Component';
import { PinNode } from './PinNode';

interface SwitchProps {
  component: CircuitComponent;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDragEnd: (x: number, y: number) => void;
  onPinClick: (pinId: string) => void;
}

export function Switch({ component, selected, onSelect, onToggle, onDragEnd, onPinClick }: SwitchProps) {
  const active = Boolean(component.state.active);

  return (
    <Group
      x={component.position.x}
      y={component.position.y}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDblClick={onToggle}
      onDragEnd={(event) => onDragEnd(event.target.x(), event.target.y())}
    >
      <Rect
        width={component.size.width}
        height={component.size.height}
        cornerRadius={10}
        fill={selected ? '#dbeafe' : '#e2e8f0'}
        stroke="#0f172a"
        strokeWidth={2}
      />
      <Text x={12} y={10} text={component.props.label} fontSize={18} fontStyle="bold" fill="#0f172a" />
      <Line
        points={active ? [28, 42, 54, 26, 82, 26] : [28, 42, 54, 42, 82, 26]}
        stroke="#1e293b"
        strokeWidth={4}
        lineCap="round"
      />
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
