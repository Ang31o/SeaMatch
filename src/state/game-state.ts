export class GameState {
  private static _isInteractive: boolean;

  static get isInteractive(): boolean {
    return this._isInteractive;
  }

  static set isInteractive(state: boolean) {
    this._isInteractive = state;
  }

  static init(): void {
    this._isInteractive = true;
  }
}
