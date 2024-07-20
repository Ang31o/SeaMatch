import Board from "./Board";
import Field from "./Field";
import Tile from "./Tile";

export class CombinationManager {
  constructor(private board: Board) {}

  getMatches(): Tile[][] {
    const result: Tile[][] = [];

    this.board.fields.forEach((field: Field) => {
      if (!field.tile) return;
      const matchesRow: Tile[] = [field.tile];
      const matchesCol: Tile[] = [field.tile];
      // Check each tile with two next tiles in a row and two next tiles in a column
      for (let i = 1; i < 3; i++) {
        const comparingFieldRow = this.board.getField(field.row + i, field.col);
        const comparingFieldCol = this.board.getField(field.row, field.col + i);
        if (comparingFieldRow?.tile?.color === field.tile?.color) {
          matchesRow.push(comparingFieldRow?.tile);
        }
        if (comparingFieldCol?.tile?.color === field.tile?.color) {
          matchesCol.push(comparingFieldCol?.tile);
        }
      }

      if (matchesRow.length >= 3) {
        result.push(matchesRow);
      }
      if (matchesCol.length >= 3) {
        result.push(matchesCol);
      }
    });

    return result;
  }
}
