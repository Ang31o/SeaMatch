import * as PIXI from "pixi.js";
import Board from "../prefabs/Board";
import { GameState } from "../state/game-state";
import Scene from "../core/Scene";
import Ui from "../prefabs/Ui";

export default class Game extends Scene {
  name = "Game";
  private board!: Board;
  private background!: PIXI.Sprite;
  private ui!: Ui;

  start(): void {
    GameState.init();
    this.addBackground();
    this.addBoard();
    this.addUi();
  }

  addBackground(): void {
    this.background = new PIXI.Sprite(PIXI.Assets.get("bg"));
    this.background.anchor.set(0.5, 1);
    this.background.position.set(innerWidth / 2, innerHeight);
    // this.background.scale.set(innerWidth / innerHeight);
    // this.background.anchor.set(0.5);
    // this.background.position.set(innerWidth / 2, innerHeight / 2);
    // this.background.setSize(Math.max(innerWidth, innerHeight));
    this.addChild(this.background);
  }

  addBoard(): void {
    this.board = new Board();
    this.addChild(this.board);
  }

  addUi(): void {
    this.ui = new Ui();
    this.addChild(this.ui);
  }

  onResize(width: number, height: number): void {
    // this.background.setSize(Math.max(width, height));
    this.background.position.set(width / 2, height);
    // this.background.setSize(Math.max(innerWidth, innerHeight));
    // this.background.position.set(innerWidth / 2, innerHeight / 2);
    this.board.resize(width);
  }
}
