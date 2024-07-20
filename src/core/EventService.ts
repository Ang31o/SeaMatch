import * as PIXI from "pixi.js";

class eventService extends PIXI.EventEmitter {
  emit<T extends string | symbol>(event: T, ...args: any[]): boolean {
    console.log(
      `%c${event.toString()}`,
      "background: #007acc; color: #FFFFFF; padding: 5px",
      args[0]
    );
    return super.emit(event, args[0]);
  }
}

export default new eventService();
