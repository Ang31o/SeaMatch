import * as PIXI from "pixi.js";
import config from "../config";
import Field from "./Field";
import Tile from "./Tile";
import { between } from "../utils/math";
import EventService from "../core/EventService";
import { Events } from "../enums/events";
import { GameState } from "../state/game-state";
import { CombinationManager } from "./CombinationManager";
export default class Board extends PIXI.Container {
  public fields!: Field[];
  private selectedTile!: Tile | null;
  private combinationManager!: CombinationManager;

  constructor() {
    super();
    this.init();
  }

  init(): void {
    this.fields = [];
    this.addFields();
    this.addTiles();
    this.addCombinationManager();
    this.removeStartMatches();
    this.resize(window.innerWidth);
    this.addEventListeners();
  }

  addFields(): void {
    for (let row = 0; row < config.board.rows; row++) {
      for (let col = 0; col < config.board.cols; col++) {
        this.addField(row, col);
      }
    }
  }

  addField(row: number, col: number): void {
    const field = new Field(row, col);
    this.addChild(field);
    this.fields.push(field);
  }

  addTiles(): void {
    this.fields.forEach((field) => this.addTile(field));
  }

  addTile(field: Field): Tile {
    const tile = new Tile(
      config.tileColors[between(0, config.tileColors.length - 1)],
      field
    );
    field.setTile(tile);
    this.addChild(tile);
    return tile;
  }

  adjustPosition(): void {
    // halfFieldSize because field has anchor(0.5)
    const halfFiledSize = this.width / config.board.rows / 2;
    this.position.set(
      (window.innerWidth - this.width) / 2 + halfFiledSize,
      (window.innerHeight - this.height) / 2 + halfFiledSize
    );
  }

  removeStartMatches(): void {
    let matches = this.combinationManager.getMatches();
    while (matches.length) {
      this.removeMatches(matches);
      const fields = this.fields.filter((field) => !field.tile);
      fields.forEach((field) => this.addTile(field));
      matches = this.combinationManager.getMatches();
    }
  }

  onTileClick(tile: Tile): void {
    if (this.selectedTile) {
      this.selectedTile.isNeighbor(tile)
        ? this.swapTile(tile)
        : this.selectTile(tile);
    } else {
      this.selectTile(tile);
    }
  }

  selectTile(tile: Tile): void {
    this.selectedTile?.field?.unselectField();
    this.selectedTile = tile;
    tile?.field?.selectField();
  }

  swapTile(tile: Tile, isReverse?: boolean): void {
    if (this.selectedTile) {
      GameState.isInteractive = false;
      const selectedField = this.selectedTile.field;
      const swapField = tile.field;
      this.selectedTile.zIndex = 2;
      swapField && this.selectedTile.moveTo(swapField?.position, 150);
      selectedField &&
        tile.moveTo(selectedField?.position, 150).then(() => {
          // Swap tiles
          selectedField.tile = tile;
          if (swapField) swapField.tile = this.selectedTile;
          // Swap fields
          if (this.selectedTile) this.selectedTile.field = swapField;
          tile.field = selectedField;
          selectedField.unselectField();
          if (!isReverse) {
            this.checkCombinations(tile);
          } else {
            this.selectedTile = null;
          }
        });
    }
  }

  checkCombinations(tile?: Tile): void {
    const matches = this.combinationManager.getMatches();
    console.log(matches);

    // If there are matches clear those tiles
    if (matches.length) {
      this.processMatches(matches);
      this.selectedTile = null;
    } else if (tile) {
      // If there are no matches, revert that last move
      // this.revertLastMove(tile);
      // Delete this when enabling revertLastMove()
      GameState.isInteractive = true;
    } else {
      GameState.isInteractive = true;
    }
  }

  revertLastMove(tile: Tile): void {
    if (this.selectedTile) {
      const prevSelectedTile = this.selectedTile;
      this.selectedTile = tile;
      this.swapTile(prevSelectedTile, true);
    }
  }

  processMatches(matches: Tile[][]): void {
    console.log("processMatches", matches);

    this.removeMatches(matches, true)
      .then(() => EventService.emit(Events.TILES_CLEAR, matches.flat().length))
      .then(() => this.processFallDown())
      .then(() => this.addTilesToEmptyFields())
      .then(() => this.checkCombinations());
  }

  removeMatches(matches: Tile[][], shouldAnimate?: boolean): Promise<void> {
    return new Promise((resolve) => {
      matches.forEach((match) => {
        match.forEach((tile) => {
          tile.remove(shouldAnimate).then(() => {
            resolve();
          });
        });
      });
    });
  }

  processFallDown(): Promise<void> {
    return new Promise((resolve) => {
      let started = 0;
      let completed = 0;

      // Check all fields of the board bottom up (from bottom-right corner)
      for (let row = config.board.rows - 1; row >= 0; row--) {
        for (let col = config.board.cols - 1; col >= 0; col--) {
          const emptyField = this.getField(row, col);

          // If there is no tile on the field
          if (emptyField && !emptyField?.tile) {
            ++started;
            this.fallDownTo(emptyField).then(() => {
              ++completed;
              if (completed >= started) resolve();
            });
          }
        }
      }
    });
  }

  fallDownTo(emptyField: Field): Promise<void> {
    for (let row = emptyField.row - 1; row >= 0; row--) {
      const fallingField = this.getField(row, emptyField.col);

      // Find the first field with a tile
      if (fallingField?.tile) {
        const fallingTile = fallingField.tile;
        fallingTile.field = emptyField;
        emptyField.tile = fallingTile;
        fallingField.tile = null;
        return fallingTile.fallDownTo(emptyField.position, 200);
      }
    }
    return Promise.resolve();
  }

  addTilesToEmptyFields(): Promise<void> {
    return new Promise((resolve) => {
      const emptyFields = this.fields.filter((field) => !field.tile);
      const total = emptyFields.length;
      let completed = 0;

      emptyFields.forEach((field) => {
        const tile = this.addTile(field);
        tile.y = -500;
        const delay = (Math.random() * 2) / 10 + 0.3 / (field.row + 1);
        tile.fallDownTo(field.position, delay).then(() => {
          ++completed;
          if (completed >= total) resolve();
        });
      });
    });
  }

  addCombinationManager(): void {
    this.combinationManager = new CombinationManager(this);
  }

  getField(row: number, col: number): Field | undefined {
    return this.fields.find((field) => field.row === row && field.col === col);
  }

  resize(width: number) {
    this.setSize(width < config.board.width ? width : config.board.width);
    this.adjustPosition();
  }

  addEventListeners(): void {
    EventService.on(Events.TILE_CLICK, this.onTileClick, this);
  }

  destroy(options?: PIXI.DestroyOptions): void {
    EventService.off(Events.TILE_CLICK, this.onTileClick, this);
    super.destroy(options);
  }
}
