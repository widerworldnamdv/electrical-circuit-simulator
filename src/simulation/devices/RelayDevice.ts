import type { CircuitComponent } from '../../models/Component';
import type { DeviceContext, DeviceLogic } from '../../types/device';

export class RelayDevice implements DeviceLogic {
  update(component: CircuitComponent, context: DeviceContext): CircuitComponent {
    const coil = context.getPinSignal(component.id, 'COIL+');
    const normallyClosed = Boolean(component.props.normallyClosed);
    const output = normallyClosed ? !coil : coil;

    context.setPinSignal(component.id, 'OUT', output);

    return {
      ...component,
      state: {
        ...component.state,
        coilEnergized: coil,
        contactClosed: output,
      },
    };
  }
}
