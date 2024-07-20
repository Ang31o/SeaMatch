import * as PIXI from "pixi.js";
import EventService from "../core/EventService";
import { Events } from "../enums/events";
import { Tween } from "@tweenjs/tween.js";
import { roundToOneDecimal } from "../utils/math";

export default class Ui extends PIXI.Container {
  private scoreText!: PIXI.Text;
  private score: number;
  constructor() {
    super();
    this.score = 0;
    this.addLabel();
    this.addEventListeners();
  }

  addLabel(): void {
    this.scoreText = new PIXI.Text({
      text: "Score: 0",
      style: {
        fontFamily: "Verdana",
        fontWeight: "bold",
        fontSize: 44,
        fill: 0xf2c511,
      },
    });
    this.addChild(this.scoreText);
  }

  onTilesClear(tilesAmount: number): void {
    const repeat = tilesAmount + 1 + (tilesAmount % 2);
    new Tween(this.scoreText.scale)
      .to({ x: 1.2, y: 1.2 }, 125)
      .repeat(repeat)
      .onRepeat((a) => {
        if (roundToOneDecimal(a.x) === 1.2) {
          this.score++;
          this.scoreText.text = `Score: ${this.score}`;
        }
      })
      .yoyo(true)
      .start();
  }

  addEventListeners(): void {
    EventService.on(Events.TILES_CLEAR, this.onTilesClear, this);
  }

  destroy(options?: PIXI.DestroyOptions): void {
    EventService.off(Events.TILES_CLEAR, this.onTilesClear, this);
    super.destroy(options);
  }
}
