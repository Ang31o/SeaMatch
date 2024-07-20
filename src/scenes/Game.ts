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
    this.background.width = window.innerWidth;
    this.background.height = window.innerHeight;
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
    this.background.setSize(Math.max(width, height));
    this.board.resize(width, height);
  }
}
