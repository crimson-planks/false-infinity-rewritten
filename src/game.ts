import Decimal from "break_eternity.js";
import { player } from "./player";
import { gameCache } from "./cache";
import { AutobuyerKindObj, getAutobuyerCostScaling, isAutobuyerUnlocked } from "./autobuyer";
import { autobuyerConstObj } from "./autobuyer_const";
import { getOverflowLimit } from "./prestige";
import { get_matterDecay_dueTo_fusion } from "./fusion";
import { variables } from "./constants";

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
  for(let i=1;i<autobuyerConstObj.matter.length;i++){
    if (isAutobuyerUnlocked({kind: AutobuyerKindObj.Matter, ord: i}) && player.autobuyers.matter[i].toggle)
      matterLost = matterLost.add(
        getAutobuyerCostScaling({kind: AutobuyerKindObj.Matter, ord: i-1}).getTotalCostAfterPurchase(
          player.autobuyers.matter[i-1].amount,
          player.autobuyers.matter[i].amount.mul(gameCache.autobuyerInterval.matter[i].cachedValue.recip())
        )
      );
  }
  if (player.autobuyers.matterAutobuyer[0].toggle){
    for(let i=0;i<autobuyerConstObj.matter.length;i++){
      if(isAutobuyerUnlocked({kind: AutobuyerKindObj.Matter, ord: i}))
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
  const nextMatter = player.matter.add(matterGained.sub(matterLost).mul(variables.diffDecimal));
  //if f(x) = mc^x, f'(0) = m*ln(c), diff = (f(0.05)-f(0))/0.05 = m(c^0.05-1)/0.05
  if(player.fusion.isFusing){
    const matterDecay = get_matterDecay_dueTo_fusion(nextMatter);
    //player.matter.mul(get_matterDecay_dueTo_fusion(player.matter).ln())
    //player.matter.mul(matterDecay.pow(0.05).sub(Decimal.dOne)).div(20);
    //since diff represents the change of matter due to fusion (which is negative), we must subtract it to add the decrease of matter due to fusion (which is positive).
    matterLost = matterLost.sub(
      nextMatter.mul(matterDecay.pow(variables.diffDecimal).sub(Decimal.dOne)).div(variables.diffDecimal)
    );
  }
  result = matterGained.sub(matterLost);
  return result;
}
export function getEstimatedOverflowTime(matterPerSecond: Decimal) {
  if(matterPerSecond.lte(0)) return Decimal.dInf;
  return getOverflowLimit().sub(player.matter).div(matterPerSecond);
}