import Decimal from "break_eternity.js";
import { player } from "./player";
import { gameCache } from "./cache";
import { AutobuyerKindObj, getAutobuyerCostScaling } from "./autobuyer";
import { autobuyerConstObj } from "./autobuyer_const";
import { getOverflowLimit } from "./prestige";

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
      getAutobuyerCostScaling({kind: AutobuyerKindObj.Matter, ord: 0}).getTotalCostAfterPurchase(
        player.autobuyers.matter[0].amount,
        player.autobuyers.matter[1].amount.mul(gameCache.autobuyerInterval.matter[1].cachedValue.recip())
      )
    );
  if (player.autobuyers.matterAutobuyer[0].toggle){
    for(let i=0;i<autobuyerConstObj.matter.length;i++){
      matterLost = matterLost.add(
        getAutobuyerCostScaling({kind: AutobuyerKindObj.Matter, ord: i})
          .getTotalCostAfterPurchase(
            player.autobuyers.matter[i].amount,
            player.autobuyers.matterAutobuyer[0].amount
          )
          .mul(gameCache.autobuyerInterval.matterAutobuyer[0].cachedValue.recip())
      );
    }
  }
  if(player.fusion.allocatedStar.gt(0)) matterLost = matterLost.add(player.fusion.allocatedStar);
  result = matterGained.sub(matterLost);
  return result;
}
export function getEstimatedOverflowTime(mps: Decimal) {
  if(mps.eq(0)) return Decimal.dInf;
  return getOverflowLimit().div(mps);
}