import { CurrencyKindObj, setCurrency } from "./currency";
import Decimal from 'break_eternity.js'
import { player } from "./player";
const HYDROGEN_FUSION_ENERGY_MULTIPLIER = new Decimal(26.73) // 26.73 eV per hydrogen fusion
export const fusionUnlockRequiredMatter = new Decimal(1e10);
function getFusionUnlockRequiredMatter(){ return fusionUnlockRequiredMatter;}
export function pourMatter(amount: Decimal){
  if(player.isOverflowing) return;
  const actualAmount = amount.min(player.matter).min(new Decimal(fusionUnlockRequiredMatter).sub(player.fusion.matterPoured));
  player.fusion.matterPoured = player.fusion.matterPoured.add(actualAmount);
  setCurrency(CurrencyKindObj.matter,player.matter.sub(actualAmount))
}
export function convertMatter(amount: Decimal){
  if(player.isOverflowing) return;
  const actualAmount = amount.min(player.matter)
  player.fusion.matterConverted = player.fusion.matterConverted.add(actualAmount);
  player.fusion.helium = player.fusion.helium.add(actualAmount.div(4))
  player.fusion.energy = player.fusion.energy.add(actualAmount.mul(HYDROGEN_FUSION_ENERGY_MULTIPLIER))
  setCurrency(CurrencyKindObj.matter,player.matter.sub(actualAmount))
}
export function allocateStar(amount: Decimal){
  const actualAmount = amount.clamp(player.fusion.allocatedStar.neg(),player.fusion.star.sub(player.fusion.allocatedStar));
  player.fusion.allocatedStar = player.fusion.allocatedStar.add(actualAmount);
}
export function getEnergyEffect(){
  return player.fusion.energy.max(0).cbrt().add(1)
}