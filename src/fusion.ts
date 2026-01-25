import { CurrencyKind, setCurrency } from "./currency";
import Decimal from "./lib/break_eternity"
import { PrimeNotation } from "./lib/eternal_notations.esm";
import { player } from "./player";
export function pourMatter(amount: Decimal){
  const actualAmount = amount.min(player.matter).min(new Decimal("1e10").sub(player.fusion.matterPoured));
  player.fusion.matterPoured = player.fusion.matterPoured.add(actualAmount);
  setCurrency(CurrencyKind.Matter,player.matter.sub(actualAmount))
}