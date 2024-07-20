import * as PIXI from "pixi.js";

export function centerObjects(...toCenter: PIXI.Container[]) {
  const center = (obj: PIXI.Container) => {
    obj.x = window.innerWidth / 2;
    obj.y = window.innerHeight / 2;

    if (obj instanceof PIXI.Sprite) {
      obj.anchor.set(0.5);
    }
  };

  toCenter.forEach(center);
}

export function wait(seconds: number) {
  return new Promise<void>((res) => setTimeout(res, seconds * 1000));
}

export async function after(
  seconds: number,
  callback: (...args: unknown[]) => unknown
) {
  await wait(seconds);
  return callback();
}

export function getEntries<T extends object>(obj: T) {
  return Object.entries(obj) as Entries<T>;
}