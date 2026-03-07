import Decimal from "break_eternity.js";
import { player } from "./player";
import { game_devTools } from "./devtools";
import { ui, type uiType } from "./ui";

declare global {
  interface Window {
    Decimal?: typeof Decimal;
    player?: typeof player;
    ui?: uiType;
    game_devTools?: typeof game_devTools;
  }
}
export function loadToWindow() {
  window.Decimal = Decimal;
  window.player = player;
  window.ui = ui;
  window.game_devTools = game_devTools;
}