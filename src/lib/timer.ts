import moment from "moment";
import { EventEmitter } from "./events";

interface ITimer {
  isOn(): void;
  reset(): void;
  start(): void;
  stop(): void;
  // time(): moment.Moment;
}

type TimerEventData = {
  time: moment.Moment
}

export type TimerEvent = "ended" | "started" | "stopped" | "tick" | "reset";

export class Timer extends EventEmitter<Timer, TimerEvent, TimerEventData> implements ITimer {
  private tick = 0;
  private moment: moment.Moment;

  constructor(private units: moment.MomentInputObject) {
    super();
    this.moment = moment(units);
  }

  reset(units?: moment.MomentInputObject) {
    this.stop();
    this.moment.set(units ?? this.units);
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
      this.tick = 0;
      this.dispatchEvent("stopped", this.getEventData());
    }
  }

  isOn() {
    return !!this.tick
  }

  get time() {
    return this.moment.clone();
  }

  private getEventData(): TimerEventData {
    return {
      time: this.time.clone()
    }
  }

  private tickHandler(): void {
    this.moment = this.moment.subtract(1, "second");
    const { time } = this;
    if (time.hours() + time.minutes() + time.seconds() === 0) {
      this.dispatchEvent("ended", this.getEventData());
      this.stop();
      return;
    }
    this.dispatchEvent("tick", this.getEventData());
  }
}
