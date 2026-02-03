import { CurrencyKind, setCurrency } from "./currency";
import Decimal from "./lib/break_eternity"
import { player } from "./player";
const HYDROGEN_FUSION_ENERGY_MULTIPLIER = new Decimal(4.282_618_142_682e-18) // 26.73 eV * J/eV
export function pourMatter(amount: Decimal){
  if(player.isOverflowing) return;
  const actualAmount = amount.min(player.matter).min(new Decimal("1e10").sub(player.fusion.matterPoured));
  player.fusion.matterPoured = player.fusion.matterPoured.add(actualAmount);
  setCurrency(CurrencyKind.Matter,player.matter.sub(actualAmount))
}
export function convertMatter(amount: Decimal){
  if(player.isOverflowing) return;
  const actualAmount = amount.min(player.matter)
  player.fusion.matterConverted = player.fusion.matterConverted.add(actualAmount);
  player.fusion.helium = player.fusion.helium.add(actualAmount.div(4))
  player.fusion.energy = player.fusion.energy.add(actualAmount.mul(HYDROGEN_FUSION_ENERGY_MULTIPLIER))
  setCurrency(CurrencyKind.Matter,player.matter.sub(actualAmount))
}
