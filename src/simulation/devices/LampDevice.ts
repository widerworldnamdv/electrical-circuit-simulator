import type { CircuitComponent } from '../../models/Component';
import type { DeviceContext, DeviceLogic } from '../../types/device';

export class LampDevice implements DeviceLogic {
  update(component: CircuitComponent, context: DeviceContext): CircuitComponent {
    const powered = context.getPinSignal(component.id, 'IN');

    return {
      ...component,
      state: {
        ...component.state,
        lampOn: powered,
      },
    };
  }
}
