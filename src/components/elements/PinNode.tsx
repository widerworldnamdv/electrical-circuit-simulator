import { Circle } from 'react-konva';

interface PinNodeProps {
  x: number;
  y: number;
  powered: boolean;
  onClick: () => void;
}

export function PinNode({ x, y, powered, onClick }: PinNodeProps) {
  return (
    <Circle
      x={x}
      y={y}
      radius={6}
      fill={powered ? '#22c55e' : '#f8fafc'}
      stroke="#0f172a"
      strokeWidth={2}
      onClick={onClick}
    />
  );
}
