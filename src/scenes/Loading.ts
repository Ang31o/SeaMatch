import * as PIXI from "pixi.js";
import Scene from "../core/Scene";
import { centerObjects } from "../utils/misc";

export default class Loading extends Scene {
  name = "Loading";
  private text!: PIXI.Text;

  async load() {
    await this.utils.assetLoader.loadAssetsGroup("Loading");

    this.text = new PIXI.Text({
      text: "Loading...",
      style: {
        fontFamily: "Verdana",
        fontSize: 50,
        fill: "white",
      },
    });
    centerObjects(this.text);
    this.addChild(this.text);
  }

  async start() {
    await this.utils.assetLoader.loadAssetsGroup("Game");
  }

  async update() {
    this.text.x += 0.4;
  }
}
