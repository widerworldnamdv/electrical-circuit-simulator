import { Group, Rect, Text } from 'react-konva';
import type { CircuitComponent } from '../../models/Component';
import { PinNode } from './PinNode';

interface PowerSourceProps {
  component: CircuitComponent;
  selected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onPinClick: (pinId: string) => void;
}

export function PowerSource({ component, selected, onSelect, onDragEnd, onPinClick }: PowerSourceProps) {
  return (
    <Group
      x={component.position.x}
      y={component.position.y}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(event) => onDragEnd(event.target.x(), event.target.y())}
    >
      <Rect width={component.size.width} height={component.size.height} cornerRadius={10} fill={selected ? '#dbeafe' : '#dcfce7'} stroke="#0f172a" strokeWidth={2} />
      <Text x={12} y={10} text={component.props.label} fontSize={18} fontStyle="bold" fill="#0f172a" />
      <Text x={14} y={32} text="SOURCE" fontSize={14} fill="#15803d" />
      {component.pins.map((pin) => (
        <PinNode
          key={pin.id}
          x={pin.offset.x}
          y={pin.offset.y}
          powered
          onClick={() => onPinClick(pin.id)}
        />
      ))}
    </Group>
  );
}
