import { Layer, Line, Rect, Stage } from 'react-konva';
import { useMemo } from 'react';
import type { CircuitComponent } from '../../models/Component';
import type { Wire } from '../../models/Wire';
import { WireRenderer } from './WireRenderer';
import { Switch } from '../elements/Switch';
import { Lamp } from '../elements/Lamp';
import { Contactor } from '../elements/Contactor';
import { Relay } from '../elements/Relay';
import { Timer } from '../elements/Timer';
import { PowerSource } from '../elements/PowerSource';
import { getPinAbsolutePosition } from '../../lib/geometry';

interface CanvasBoardProps {
  components: CircuitComponent[];
  wires: Wire[];
  selectedComponentId: string | null;
  pendingWireFromPinId: string | null;
  onComponentMove: (componentId: string, position: { x: number; y: number }) => void;
  onSelectComponent: (componentId: string | null) => void;
  onToggleSwitch: (componentId: string) => void;
  onPinClick: (pinId: string) => void;
}

const width = 1180;
const height = 680;

export function CanvasBoard({
  components,
  wires,
  selectedComponentId,
  pendingWireFromPinId,
  onComponentMove,
  onSelectComponent,
  onToggleSwitch,
  onPinClick,
}: CanvasBoardProps) {
  const pendingLine = useMemo(() => {
    if (!pendingWireFromPinId) return null;
    const component = components.find((item) => item.pins.some((pin) => pin.id === pendingWireFromPinId));
    if (!component) return null;
    const pos = getPinAbsolutePosition(component, pendingWireFromPinId);
    if (!pos) return null;
    return [pos.x, pos.y, pos.x + 60, pos.y - 20];
  }, [components, pendingWireFromPinId]);

  return (
    <Stage width={width} height={height} onMouseDown={(event) => event.target === event.target.getStage() && onSelectComponent(null)}>
      <Layer>
        {Array.from({ length: 34 }).map((_, index) => (
          <Line key={`v-${index}`} points={[index * 35, 0, index * 35, height]} stroke="#e2e8f0" strokeWidth={1} />
        ))}
        {Array.from({ length: 20 }).map((_, index) => (
          <Line key={`h-${index}`} points={[0, index * 35, width, index * 35]} stroke="#e2e8f0" strokeWidth={1} />
        ))}
        <Rect x={0} y={0} width={width} height={height} stroke="#cbd5e1" strokeWidth={1} />
      </Layer>

      <Layer>
        {wires.map((wire) => (
          <WireRenderer key={wire.id} wire={wire} components={components} />
        ))}
        {pendingLine ? <Line points={pendingLine} stroke="#0ea5e9" strokeWidth={3} dash={[8, 6]} /> : null}
      </Layer>

      <Layer>
        {components.map((component) => {
          const commonProps = {
            key: component.id,
            component,
            selected: selectedComponentId === component.id,
            onSelect: () => onSelectComponent(component.id),
            onDragEnd: (x: number, y: number) => onComponentMove(component.id, { x, y }),
            onPinClick: (pinId: string) => onPinClick(pinId),
          };

          switch (component.type) {
            case 'switch':
              return <Switch {...commonProps} onToggle={() => onToggleSwitch(component.id)} />;
            case 'lamp':
              return <Lamp {...commonProps} />;
            case 'contactor':
              return <Contactor {...commonProps} />;
            case 'relay':
              return <Relay {...commonProps} />;
            case 'timer':
              return <Timer {...commonProps} />;
            case 'powerSource':
              return <PowerSource {...commonProps} />;
          }
        })}
      </Layer>
    </Stage>
  );
}
