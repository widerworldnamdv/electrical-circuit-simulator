import type { CircuitComponent } from '../../models/Component';
import type { DeviceContext, DeviceLogic } from '../../types/device';

export class SwitchDevice implements DeviceLogic {
  update(component: CircuitComponent, context: DeviceContext): CircuitComponent {
    const input = context.getPinSignal(component.id, 'IN');
    const active = Boolean(component.state.active);
    const output = input && active;

    context.setPinSignal(component.id, 'OUT', output);

    return {
      ...component,
      state: {
        ...component.state,
        contactClosed: active,
      },
    };
  }
}
