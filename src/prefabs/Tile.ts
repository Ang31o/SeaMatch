import * as PIXI from "pixi.js";
import * as TWEEN from "@tweenjs/tween.js";
import Field from "./Field";
import EventService from "../core/EventService";
import { Events } from "../enums/events";
import { GameState } from "../state/game-state";

export default class Tile extends PIXI.Container {
  private sprite!: PIXI.Sprite;
  constructor(public color: string, public field: Field | null) {
    super({ x: field?.x, y: field?.y });
    this.init();
    this.makeInteractive();
  }

  init(): void {
    this.sprite = new PIXI.Sprite(PIXI.Assets.get(this.color));
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);
  }

  onPointerDown(): void {
    if (GameState.isInteractive) EventService.emit(Events.TILE_CLICK, this);
  }

  makeInteractive(): void {
    this.interactive = true;
    this.cursor = "pointer";
    this.on("pointerdown", this.onPointerDown, this);
  }

  isNeighbor(tile: Tile): boolean {
    if (this.field && tile.field) {
      return (
        Math.abs(this.field.row - tile.field.row) +
          Math.abs(this.field.col - tile.field.col) ===
        1
      );
    } else {
      return false;
    }
  }

  moveTo(
    position: { x: number; y: number },
    duration: number,
    delay = 0,
    ease: (amount: number) => number = TWEEN.Easing.Linear.In
  ): Promise<void> {
    return new Promise((resolve) => {
      new TWEEN.Tween(this)
        .to({ x: position.x, y: position.y }, duration)
        .delay(delay || 0)
        .easing(ease)
        .onComplete(() => {
          this.zIndex = 1;
          resolve();
        })
        .start();
    });
  }

  fallDownTo(position: { x: number; y: number }, delay: number): Promise<void> {
    return this.moveTo(position, 500, delay, TWEEN.Easing.Bounce.Out);
  }

  remove(shouldAnimate?: boolean): Promise<void> {
    return new Promise((resolve) => {
      if (!this.sprite) {
        resolve();
      }
      if (shouldAnimate) {
        new TWEEN.Tween(this.scale)
          .to({ x: 1.2, y: 1.2 }, 700)
          .yoyo(true)
          .easing(TWEEN.Easing.Back.In)
          .repeat(1)
          .onComplete(() => {
            this.removeComplete();
            resolve();
          })
          .start();
      } else {
        this.removeComplete();
        resolve();
      }
    });
  }

  removeComplete(): void {
    this.field?.removeTile();
    this.destroy();
  }
}
