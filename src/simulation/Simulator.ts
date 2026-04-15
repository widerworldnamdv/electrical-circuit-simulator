import type { Circuit } from '../models/Circuit';
import type { CircuitComponent } from '../models/Component';
import type { Pin } from '../models/Pin';
import { SignalEngine } from '../core/SignalEngine';
import { SwitchDevice } from './devices/SwitchDevice';
import { LampDevice } from './devices/LampDevice';
import { ContactorDevice } from './devices/ContactorDevice';
import { RelayDevice } from './devices/RelayDevice';
import { TimerDevice } from './devices/TimerDevice';
import type { DeviceContext, DeviceLogic } from '../types/device';

export class Simulator {
  private signalEngine = new SignalEngine();
  private devices: Record<string, DeviceLogic> = {
    switch: new SwitchDevice(),
    lamp: new LampDevice(),
    contactor: new ContactorDevice(),
    relay: new RelayDevice(),
    timer: new TimerDevice(),
  };

  run(inputCircuit: Circuit): Circuit {
    let circuit = this.resetSignals(inputCircuit);
    const now = Date.now();

    for (let step = 0; step < 4; step += 1) {
      const injections = this.collectPowerInjections(circuit);
      const propagation = this.signalEngine.propagate(circuit, injections);
      circuit = this.applyPropagation(circuit, propagation.poweredPins, propagation.poweredWires);
      circuit = this.updateDevices(circuit, now);
    }

    return circuit;
  }

  private resetSignals(circuit: Circuit): Circuit {
    return {
      components: circuit.components.map((component) => ({
        ...component,
        pins: component.pins.map((pin) => ({ ...pin, signal: false })),
      })),
      wires: circuit.wires.map((wire) => ({ ...wire, signal: false })),
    };
  }

  private collectPowerInjections(circuit: Circuit) {
    return circuit.components
      .filter((component) => component.type === 'powerSource')
      .flatMap((component) =>
        component.pins
          .filter((pin) => pin.role === 'output')
          .map((pin) => ({ sourcePinId: pin.id })),
      );
  }

  private applyPropagation(circuit: Circuit, poweredPins: Set<string>, poweredWires: Set<string>): Circuit {
    return {
      components: circuit.components.map((component) => ({
        ...component,
        pins: component.pins.map((pin) => ({
          ...pin,
          signal: poweredPins.has(pin.id),
        })),
      })),
      wires: circuit.wires.map((wire) => ({
        ...wire,
        signal: poweredWires.has(wire.id),
      })),
    };
  }

  private updateDevices(circuit: Circuit, now: number): Circuit {
    const components = structuredClone(circuit.components) as CircuitComponent[];
    const componentMap = new Map(components.map((component) => [component.id, component]));
    const pinMap = new Map<string, Pin>();

    components.forEach((component) => {
      component.pins.forEach((pin) => {
        pinMap.set(pin.id, pin);
      });
    });

    const context: DeviceContext = {
      circuit: { components, wires: circuit.wires },
      now,
      getComponentById: (componentId) => componentMap.get(componentId),
      getPinSignal: (componentId, pinLabel) => {
        const component = componentMap.get(componentId);
        return component?.pins.find((pin) => pin.label === pinLabel)?.signal ?? false;
      },
      setPinSignal: (componentId, pinLabel, signal) => {
        const component = componentMap.get(componentId);
        const pin = component?.pins.find((candidate) => candidate.label === pinLabel);
        if (pin) {
          pin.signal = signal;
        }
      },
    };

    const nextComponents = components.map((component) => {
      const device = this.devices[component.type];
      if (!device) return component;
      const updated = device.update(component, context);
      componentMap.set(updated.id, updated);
      updated.pins.forEach((pin) => pinMap.set(pin.id, pin));
      return updated;
    });

    return {
      components: nextComponents,
      wires: circuit.wires,
    };
  }
}
