import Decimal from "break_eternity.js";
import { player } from "./player";
import { gameCache } from "./cache";
import { AutobuyerKindObj, getAutobuyerCostScaling } from "./autobuyer";

export function getPlayTime() {
  return player.currentTime - player.createdTime;
}
export function getMatterPerSecond() {
  const pa = player.autobuyers;
  let result = new Decimal(0);
  let matterGained = player.autobuyers.matter[0].amount
    .mul(gameCache.autobuyerInterval.matter[0].cachedValue.recip())
    .mul(+player.autobuyers.matter[0].toggle);
  let matterLost = new Decimal(0);
  if (player.autobuyers.matter[1].toggle)
    matterLost = matterLost.add(
      getAutobuyerCostScaling(AutobuyerKindObj.Matter, 0).getTotalCostAfterPurchase(
        player.autobuyers.matter[0].amount,
        player.autobuyers.matter[1].amount.mul(gameCache.autobuyerInterval.matter[1].cachedValue.recip())
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
        .mul(gameCache.autobuyerInterval.matterAutobuyer[0].cachedValue.recip())
    );
  result = matterGained.sub(matterLost);
  return result;
}