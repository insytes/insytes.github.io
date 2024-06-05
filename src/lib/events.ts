export interface IEvent<Target, EventData> {
  target: Target;
  type: string;
  data?: EventData;
}

type EventName = string | symbol;
type EventHandler<Target, EventData> = (event: IEvent<Target, EventData>) => void;
type EventHandlerDict<Event extends EventName, Target, EventData> = Record<Event, EventHandler<Target, EventData>[]>;

export class EventEmitter<Target, Event extends EventName, EventData> {
  private callbacks = {} as EventHandlerDict<Event, Target, EventData>;

  static Event = class Event<Target, EventData> implements IEvent<Target, EventData> {
    constructor(public type: string, public target: Target, public data?: EventData) {}
  };

  on(eventType: Event, callback: EventHandler<Target, EventData>) {
    this.callbacks[eventType] = this.callbacks[eventType] || [];
    this.callbacks[eventType].push(callback);
  }

  dispatchEvent(eventType: Event, data?: EventData) {
    const eventCallbacks = this.callbacks[eventType];
    if (eventCallbacks) {
      const event = new EventEmitter.Event<Target, EventData>(eventType as string, this as unknown as Target,data
      );
      eventCallbacks.forEach(callback => callback(event));
    }
  }
}
