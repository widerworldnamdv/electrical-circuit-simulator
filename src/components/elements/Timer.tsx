import { Group, Rect, Text, Arc } from 'react-konva';
import type { CircuitComponent } from '../../models/Component';
import { PinNode } from './PinNode';

interface TimerProps {
  component: CircuitComponent;
  selected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onPinClick: (pinId: string) => void;
}

export function Timer({ component, selected, onSelect, onDragEnd, onPinClick }: TimerProps) {
  const active = Boolean(component.state.timerRunning || component.state.timerElapsed);

  return (
    <Group
      x={component.position.x}
      y={component.position.y}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(event) => onDragEnd(event.target.x(), event.target.y())}
    >
      <Rect width={component.size.width} height={component.size.height} cornerRadius={10} fill={selected ? '#dbeafe' : '#f1f5f9'} stroke="#0f172a" strokeWidth={2} />
      <Text x={12} y={10} text={component.props.label} fontSize={18} fontStyle="bold" fill="#0f172a" />
      <Text x={12} y={34} text={`${component.props.delayMs ?? 1500} ms`} fontSize={14} fill="#334155" />
      <Arc x={96} y={46} innerRadius={10} outerRadius={18} angle={active ? 300 : 60} rotation={-90} fill={active ? '#38bdf8' : '#cbd5e1'} />
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
