import { EventEmitter } from "./events";
import dayjs, { ConfigTypeMap } from "dayjs";
import objectSupport from 'dayjs/plugin/objectSupport';

interface ITimer {
  isOn(): void;
  reset(): void;
  start(): void;
  stop(): void;
}

export type TimerEventData = {
  time: dayjs.Dayjs
}

export type TimerEvent = "ended" | "started" | "stopped" | "tick" | "reset";

export class Timer extends EventEmitter<Timer, TimerEvent, TimerEventData> implements ITimer {
  private tick: null | ReturnType<typeof setTimeout> = null
  private dayjs: dayjs.Dayjs;

  constructor(public units: ConfigTypeMap["objectSupport"]) {
    super();
    dayjs.extend(objectSupport);
    this.dayjs = dayjs(units);
  }

  reset(units?: ConfigTypeMap["objectSupport"]) {
    this.stop();
    this.dayjs = this.dayjs.set(units ?? this.units);
    this.dispatchEvent("reset", this.getEventData());
  }

  start() {
    if (!this.tick) {
      this.dispatchEvent("started", this.getEventData());
      this.tick = setInterval(this.tickHandler.bind(this), 1000);
    }
  }

  stop() {
    if (this.tick) {
      clearInterval(this.tick);
      this.tick = null;
      this.dispatchEvent("stopped", this.getEventData());
    }
  }

  isOn() {
    return !!this.tick
  }

  get time() {
    return this.dayjs
  }

  private getEventData(): TimerEventData {
    return {
      time: this.dayjs
    }
  }

  private tickHandler(): void {
    this.dayjs = this.dayjs.subtract(1, "second");
    const { time } = this;
    if (time.get('hours') + time.get('minutes') + time.get('seconds') === 0) {
      this.dispatchEvent("ended", this.getEventData());
      this.stop();
      return;
    }
    this.dispatchEvent("tick", this.getEventData());
  }
}
