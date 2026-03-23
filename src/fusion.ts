import { CurrencyKindObj, setCurrency } from "./currency";
import Decimal from 'break_eternity.js'
import { getDefaultPlayer, player } from "./player";
import { getStartMatter, resetAutobuyers } from "./prestige";
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
export function ToggleFusion(){
  player.fusion.isFusing = !player.fusion.isFusing;
  console.log(`toggle fusion ${player.fusion.isFusing}`);

  resetAutobuyers();
  player.matter = getStartMatter();
  player.deflationPower = Decimal.dZero;
  player.deflation = Decimal.dZero;
  player.deflator = Decimal.dZero;
  player.previousSacrificeDeflationPower = Decimal.dZero;
  player.autobuyers.deflationPower = getDefaultPlayer().autobuyers.deflationPower;
}
export function get_matterDecay_dueTo_fusion(matter: Decimal){
  return matter.max(1).pow(player.fusion.allocatedStar.add(1).max(1)).pow(1/300).recip();
}
export function allocateStar(amount: Decimal){
  const actualAmount = amount.clamp(player.fusion.allocatedStar.neg(),player.fusion.star.sub(player.fusion.allocatedStar));
  player.fusion.allocatedStar = player.fusion.allocatedStar.add(actualAmount);
}
export function getEnergyGainWhenFusing(){
  return new Decimal(1).add(player.extendOverflow.currentLevel).pow(player.fusion.allocatedStar.sqrt().div(2).add(1));
}
export function getEnergyEffect(energy: Decimal){
  return energy.add(1).max(1).log10().pow(0.75).add(1)
}
export function getHeliumPerSecond(){
  return player.matter.div(2_147_483_648).pow(1/16).mul(player.fusion.allocatedStar.pow_base(1.2));
}