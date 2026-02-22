/** @prettier */
import './assets/main.css';

import { createApp } from 'vue';

import Decimal from 'break_eternity.js';
import App from './App.vue';
import {
  type AutobuyerKind,
  AutobuyerKindArr,
  AutobuyerKindObj,
  AutobuyerTick,
  BuyInterval,
  getAutobuyerCostScaling,
  getAutobuyerInterval,
  getIntervalCostScaling
} from './autobuyer';
import { getDefaultPlayer, player, setPlayer } from './player';
import { updateScreen, ui, initInput } from './ui';
import { gameCache } from './cache';
import {
  load,
  save,
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
    .mul(getAutobuyerInterval('matter', 0).recip())
    .mul(+player.autobuyers.matter[0].toggle);
  let matterLost = new Decimal(0);
  if (player.autobuyers.matter[1].toggle)
    matterLost = matterLost.add(
      getAutobuyerCostScaling(AutobuyerKindObj.Matter, 0).getTotalCostAfterPurchase(
        player.autobuyers.matter[0].amount,
        player.autobuyers.matter[1].amount.mul(getAutobuyerInterval('matter', 1).recip())
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
        .mul(getAutobuyerInterval('matterAutobuyer', 0).recip())
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

  for(let ak of AutobuyerKindArr){
    if (ak == AutobuyerKindObj.Matter && player.isOverflowing) return;
    player.autobuyers[ak].forEach((v, i)=>{AutobuyerTick(ak, i, diffDecimal);})
  }

  //the order is very important.
  gameCache.upgradeEffectValue.overflow.forEach((v, i) => {
    v.invalidate();
  });
  gameCache.deflatorGainOnDeflation.invalidate();
  gameCache.translatedDeflationPowerMultiplierBySacrificedDeflationPower.invalidate();
  gameCache.translatedDeflationPowerMultiplierWhenSacrifice.invalidate();
  gameCache.translatedDeflationPower.invalidate();
  gameCache.canDeflationSacrifice.invalidate();
  for(let ak of AutobuyerKindArr){
    gameCache.autobuyerInterval[ak].forEach((v)=>{
      v.invalidate();
    })
  }
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
