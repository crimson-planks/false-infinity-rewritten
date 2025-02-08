//TODO: make tabs and subtabs
import { ref } from "vue";
import { player } from "./player";
import { formatValue, NotationName } from '@/notation'
import { getAutobuyerCostScaling, AutobuyerKind, getIntervalCostScaling, autobuyerCurrency, autobuyerName } from "./autobuyer";
import { deflationCost } from "./prestige";
import { gameCache } from "./cache";
import { getCurrency } from "./currency";
export interface AutobuyerVisualData{
  kind: AutobuyerKind;
  ord: number;
  name: string;
  amount: string;
  timer: string;
  interval: string;
  toggle: string;
  cost: string;
  intervalCost: string;
  canBuy: boolean;
  canBuyInterval: boolean;
}
export type TabName = "autobuyer" | "option"
export type SubtabName = "matter" | "deflation"
export const ui = ref({
  tab: "autobuyer",
  subtab: "matter",
  matter: "0",
  deflationCost: "",
  autobuyers: {
    matter: Array(player.autobuyers.matter.length).fill(0).map((v, i)=>{return {
      kind: AutobuyerKind.Matter,
      ord: i,
      name: autobuyerName.matter[i],
      amount: "0",
      timer: "0",
      toggle: 'true',
      interval: "",
      cost: "10",
      intervalCost: "",
      canBuy: false,
      canBuyInterval: false,
    }})
  },
  deflationPower: "",
  translatedDeflationPower: "",
  deflator: "",
})
export function updateScreen(){
  ui.value.matter=formatValue(player.matter, NotationName.Default);
  ui.value.deflationCost=formatValue(deflationCost.getCurrentCost(player.deflation), NotationName.Default);
  ui.value.deflationPower = formatValue(player.deflationPower, NotationName.Default);
  ui.value.translatedDeflationPower = formatValue(gameCache.translatedDeflationPower.cachedValue, NotationName.Default);
  ui.value.deflator = formatValue(player.deflator, NotationName.Default);
  for(let i=0;i<player.autobuyers.matter.length;i++){
    ui.value.autobuyers.matter[i].kind = player.autobuyers.matter[i].kind;
    ui.value.autobuyers.matter[i].ord = player.autobuyers.matter[i].ord;
    ui.value.autobuyers.matter[i].amount = formatValue(player.autobuyers.matter[i].amount, NotationName.Default);
    ui.value.autobuyers.matter[i].timer = formatValue(player.autobuyers.matter[i].timer, NotationName.Default);
    ui.value.autobuyers.matter[i].interval = formatValue(player.autobuyers.matter[i].interval, NotationName.Default);
    ui.value.autobuyers.matter[i].toggle = player.autobuyers.matter[i].toggle.toString();
    ui.value.autobuyers.matter[i].cost = formatValue(getAutobuyerCostScaling(AutobuyerKind.Matter,i).getCurrentCost(player.autobuyers.matter[i].amount), NotationName.Default);
    ui.value.autobuyers.matter[i].intervalCost = formatValue(getIntervalCostScaling(AutobuyerKind.Matter,i).getCurrentCost(player.autobuyers.matter[i].intervalAmount), NotationName.Default);
    ui.value.autobuyers.matter[i].canBuy = getAutobuyerCostScaling(AutobuyerKind.Matter,i).getCurrentCost(player.autobuyers.matter[i].amount).lte(getCurrency(autobuyerCurrency.matter[i]));
    ui.value.autobuyers.matter[i].canBuyInterval = getIntervalCostScaling(AutobuyerKind.Matter,i).getCurrentCost(player.autobuyers.matter[i].intervalAmount).lte(getCurrency(autobuyerCurrency.matter[i]))
  }
}
export function input(type: string,args: Array<string>){
  if(type==="ClickMatterButton") player.matter=player.matter.add(1);
  if(type==="ClickDeflationPowerButton") player.deflationPower=player.deflationPower.add(1);
  if(type==="ChangeTab") ui.value.tab = args[0];
  if(type==="ChangeSubtab") ui.value.subtab = args[0];
}