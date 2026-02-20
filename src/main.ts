/** @prettier */
import './assets/main.css';

import { createApp } from 'vue';

import Decimal from 'break_eternity.js';
import App from './App.vue';
import {
  type AutobuyerKind,
  AutobuyerKindObj,
  AutobuyerTick,
  BuyInterval,
  getAutobuyerCostScaling,
  getIntervalCostScaling
} from './autobuyer';
import { getDefaultPlayer, player, setPlayer } from './player';
import { updateScreen, ui, initInput } from './ui';
import { gameCache } from './cache';
import {
  load,
  save,
  toStringifiableObject,
  toUsableObject,
  mergeObj_nocopy,
  fixSave
} from './saveload';
import { game_devTools } from './devtools';
import { overflow, OVERFLOW } from './prestige';
import { CurrencyKindObj, getCurrency } from './currency';
import { fusionUnlockRequiredMatter } from './fusion';

declare global {
  interface Window {
    Decimal?: typeof Decimal;
    player?: typeof player;
    game_devTools?: typeof game_devTools;
  }
}
function loadToWindow() {
  window.Decimal = Decimal;
  window.player = player;
  window.game_devTools = game_devTools;
}

const app = createApp(App);
app.mount('#app');
load();
fixSave();
initInput();
let autosaveTimer = 0;
export function getPlayTime() {
  return player.currentTime - player.createdTime;
}
export function getMatterPerSecond() {
  const pa = player.autobuyers;
  let result = new Decimal(0);
  let matterGained = player.autobuyers.matter[0].amount
    .mul(player.autobuyers.matter[0].interval.recip())
    .mul(+player.autobuyers.matter[0].toggle);
  let matterLost = new Decimal(0);
  if (player.autobuyers.matter[1].toggle)
    matterLost = matterLost.add(
      getAutobuyerCostScaling(AutobuyerKindObj.Matter, 0).getTotalCostAfterPurchase(
        player.autobuyers.matter[0].amount,
        player.autobuyers.matter[1].amount.mul(player.autobuyers.matter[1].interval.recip())
      )
    );
  const pama_selectedOrd = Number(player.autobuyers.matterAutobuyer[0].option?.selectedOrd);
  if (player.autobuyers.matterAutobuyer[0].toggle)
    matterLost = matterLost.add(
      getAutobuyerCostScaling(AutobuyerKindObj.Matter, pama_selectedOrd)
        .getTotalCostAfterPurchase(
          player.autobuyers.matter[pama_selectedOrd].amount,
          player.autobuyers.matterAutobuyer[0].amount
        )
        .mul(player.autobuyers.matterAutobuyer[0].interval.recip())
    );
  result = matterGained.sub(matterLost);
  return result;
}
setInterval(function () {
  const previousTime = player.currentTime;
  player.currentTime = Date.now();
  const diff = (player.currentTime - previousTime) / 1000;
  const diffDecimal = new Decimal(diff);
  autosaveTimer = autosaveTimer + diff;
  if (autosaveTimer >= 10) {
    save();
    autosaveTimer = 0;
    console.log('game saved!');
  }
  //@ts-ignore
  Object.keys(player.autobuyers).forEach((key: AutobuyerKind) => {
    if (key == AutobuyerKindObj.Matter && player.isOverflowing) return;
    for (let i = 0; i < player.autobuyers[key].length; i++) {
      AutobuyerTick(key, i, diffDecimal);
    }
  });

  gameCache.upgradeEffectValue.overflow.forEach((v, i) => {
    v.invalidate();
  });
  gameCache.deflatorGainOnDeflation.invalidate();
  gameCache.translatedDeflationPowerMultiplierBySacrificedDeflationPower.invalidate();
  gameCache.translatedDeflationPowerMultiplierWhenSacrifice.invalidate();
  gameCache.translatedDeflationPower.invalidate();
  gameCache.canDeflationSacrifice.invalidate();
  if (player.matter.gte(OVERFLOW) && !player.isOverflowing) {
    player.isOverflowing = true;
    player.matter = OVERFLOW;
  }
  if (player.fusion.matterPoured.gte(fusionUnlockRequiredMatter) && !player.fusion.unlocked) {
    player.fusion.unlocked = true;
  }
  updateScreen();
}, 50);

addEventListener('keypress', (ev) => {
  if (ev.code === 'KeyM') {
    for (let i = 0; i < player.autobuyers.matter.length; i++) {
      BuyInterval(
        AutobuyerKindObj.Matter,
        i,
        getIntervalCostScaling(AutobuyerKindObj.Matter, i)
          .getAvailablePurchases(
            player.autobuyers.matter[i].intervalAmount,
            getCurrency(CurrencyKindObj.matter)
          )
          .max(0)
          .floor()
      );
    }
  }
});
(function () {})();
setTimeout(loadToWindow, 100);
