import { useMemo } from 'react';
import { CanvasBoard } from './components/canvas/CanvasBoard';
import { useCircuitStore } from './store/useCircuitStore';
import type { ComponentType } from './models/Component';
import './styles.css';

const palette: { type: ComponentType; label: string }[] = [
  { type: 'powerSource', label: 'Power Source' },
  { type: 'switch', label: 'Switch' },
  { type: 'lamp', label: 'Lamp' },
  { type: 'contactor', label: 'Contactor' },
  { type: 'relay', label: 'Relay' },
  { type: 'timer', label: 'Timer' },
];

export default function App() {
  const {
    components,
    wires,
    selectedComponentId,
    pendingWire,
    runCount,
    addComponent,
    moveComponent,
    selectComponent,
    toggleSwitch,
    updateComponentProps,
    startWire,
    finishWire,
    cancelWire,
    runSimulation,
    resetCircuit,
  } = useCircuitStore();

  const selected = useMemo(
    () => components.find((component) => component.id === selectedComponentId) ?? null,
    [components, selectedComponentId],
  );

  const handlePinClick = (pinId: string) => {
    if (!pendingWire) {
      startWire(pinId);
      return;
    }
    if (pendingWire.fromPinId === pinId) {
      cancelWire();
      return;
    }
    finishWire(pinId);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar panel">
        <div>
          <div className="eyebrow">Electrical Circuit Simulator</div>
          <h1>PRO</h1>
        </div>

        <div className="sidebar-group">
          <div className="group-title">Components</div>
          <div className="component-list">
            {palette.map((item) => (
              <button key={item.type} className="component-card" onClick={() => addComponent(item.type)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-group compact">
          <div className="group-title">Quick Tips</div>
          <ul>
            <li>Double click switch to toggle.</li>
            <li>Click one pin, then another pin to create wire.</li>
            <li>Run simulation to propagate power.</li>
          </ul>
        </div>
      </aside>

      <main className="workspace">
        <header className="toolbar panel">
          <div className="toolbar-left">
            <button className="primary" onClick={runSimulation}>
              Run Simulation
            </button>
            <button onClick={resetCircuit}>Reset</button>
            {pendingWire ? <button onClick={cancelWire}>Cancel Wire</button> : null}
          </div>
          <div className="toolbar-stats">
            <span>{components.length} devices</span>
            <span>{wires.length} wires</span>
            <span>{runCount} runs</span>
          </div>
        </header>

        <section className="canvas-wrap panel">
          <CanvasBoard
            components={components}
            wires={wires}
            selectedComponentId={selectedComponentId}
            pendingWireFromPinId={pendingWire?.fromPinId ?? null}
            onComponentMove={moveComponent}
            onSelectComponent={selectComponent}
            onToggleSwitch={toggleSwitch}
            onPinClick={handlePinClick}
          />
        </section>
      </main>

      <aside className="inspector panel">
        <div className="group-title">Inspector</div>
        {selected ? (
          <div className="inspector-content">
            <label>
              Label
              <input
                value={String(selected.props.label ?? '')}
                onChange={(event) => updateComponentProps(selected.id, { label: event.target.value })}
              />
            </label>

            {selected.type === 'timer' ? (
              <label>
                Delay (ms)
                <input
                  type="number"
                  value={Number(selected.props.delayMs ?? 1500)}
                  onChange={(event) =>
                    updateComponentProps(selected.id, { delayMs: Number(event.target.value || 0) })
                  }
                />
              </label>
            ) : null}

            {selected.type === 'relay' ? (
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={Boolean(selected.props.normallyClosed)}
                  onChange={(event) =>
                    updateComponentProps(selected.id, { normallyClosed: event.target.checked })
                  }
                />
                Normally closed
              </label>
            ) : null}

            {selected.type === 'contactor' ? (
              <label>
                Self-hold switch id
                <input
                  value={String(selected.props.holdTargetId ?? '')}
                  onChange={(event) => updateComponentProps(selected.id, { holdTargetId: event.target.value })}
                />
              </label>
            ) : null}

            <div className="state-box">
              <div className="group-title">State</div>
              <pre>{JSON.stringify(selected.state, null, 2)}</pre>
            </div>
          </div>
        ) : (
          <div className="empty-state">Select a component to edit properties.</div>
        )}
      </aside>
    </div>
  );
}
