import type { CircuitComponent } from '../../models/Component';
import type { DeviceContext, DeviceLogic } from '../../types/device';

export class ContactorDevice implements DeviceLogic {
  update(component: CircuitComponent, context: DeviceContext): CircuitComponent {
    const coil = context.getPinSignal(component.id, 'COIL+');
    const holdTargetId = component.props.holdTargetId;
    const currentLatched = Boolean(component.state.latched);

    let latched = currentLatched;
    if (coil) latched = true;
    if (holdTargetId) {
      const holdComponent = context.getComponentById(holdTargetId);
      if (holdComponent?.type === 'switch' && holdComponent.state.active === false && !coil) {
        latched = false;
      }
    }
    if (!holdTargetId && !coil) {
      latched = false;
    }

    context.setPinSignal(component.id, 'NO_OUT', latched);

    return {
      ...component,
      state: {
        ...component.state,
        coilEnergized: coil,
        latched,
        contactClosed: latched,
      },
    };
  }
}
