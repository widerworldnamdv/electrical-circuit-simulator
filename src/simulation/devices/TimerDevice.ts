import type { CircuitComponent } from '../../models/Component';
import type { DeviceContext, DeviceLogic } from '../../types/device';

export class TimerDevice implements DeviceLogic {
  update(component: CircuitComponent, context: DeviceContext): CircuitComponent {
    const input = context.getPinSignal(component.id, 'IN');
    const delayMs = Number(component.props.delayMs ?? 1500);
    const lastTriggeredAt = component.state.lastTriggeredAt ?? null;

    let nextTriggeredAt = lastTriggeredAt;
    let timerElapsed = Boolean(component.state.timerElapsed);

    if (input && !lastTriggeredAt) {
      nextTriggeredAt = context.now;
      timerElapsed = false;
    }

    if (!input) {
      nextTriggeredAt = null;
      timerElapsed = false;
    }

    if (input && nextTriggeredAt) {
      timerElapsed = context.now - nextTriggeredAt >= delayMs;
    }

    context.setPinSignal(component.id, 'OUT', input && timerElapsed);

    return {
      ...component,
      state: {
        ...component.state,
        timerRunning: input && !timerElapsed,
        timerElapsed,
        lastTriggeredAt: nextTriggeredAt,
      },
    };
  }
}
