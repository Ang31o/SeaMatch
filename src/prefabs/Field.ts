import * as PIXI from "pixi.js";
import Tile from "./Tile";

export default class Field extends PIXI.Container {
  private sprite!: PIXI.Sprite;
  public tile?: Tile | null;
  constructor(public row: number, public col: number) {
    super();
    this.addField();
    this.position.set(
      this.col * this.sprite.width,
      this.row * this.sprite.height
    );
  }

  addField(): void {
    this.sprite = new PIXI.Sprite(PIXI.Assets.get("field"));
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);
  }

  setTile(tile: Tile): void {
    this.tile = tile;
  }

  selectField(): void {
    this.sprite.texture = PIXI.Assets.get("field-selected");
  }

  unselectField(): void {
    this.sprite.texture = PIXI.Assets.get("field");
  }

  removeTile(): void {
    this.tile = null;
  }
}
