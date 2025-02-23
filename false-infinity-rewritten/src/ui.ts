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
export const tabs: {
  [key: TabName]: {
    name: string,
    subtab: {
      
    }
  }
}={
  autobuyer: {
    name: "Autobuyer",
    subtab:{
      matter: {
        name: "Matter"
      },
      deflation: {
        name: "Deflation"
      }
    }
  },
  option: {
    name: "Option",
    subtab:{
      option: {
        name: "Option"
      }
    }
  }
}
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
    }}),
    deflationPower: Array(player.autobuyers.matter.length).fill(0).map((v, i)=>{return {
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
  //@ts-ignore: this is a valid way of iterating through an Object
  Object.keys(AutobuyerKind).forEach((ak: AutobuyerKind)=>{
    for(let i=0;i<player.autobuyers[ak].length;i++){
      ui.value.autobuyers[ak][i].kind = player.autobuyers[ak][i].kind;
      ui.value.autobuyers[ak][i].ord = player.autobuyers[ak][i].ord;
      ui.value.autobuyers[ak][i].amount = formatValue(player.autobuyers[ak][i].amount, NotationName.Default);
      ui.value.autobuyers[ak][i].timer = formatValue(player.autobuyers[ak][i].timer, NotationName.Default);
      ui.value.autobuyers[ak][i].interval = formatValue(player.autobuyers[ak][i].interval, NotationName.Default);
      ui.value.autobuyers[ak][i].toggle = player.autobuyers[ak][i].toggle.toString();
      ui.value.autobuyers[ak][i].cost = formatValue(getAutobuyerCostScaling(AutobuyerKind.Matter,i).getCurrentCost(player.autobuyers[ak][i].amount), NotationName.Default);
      ui.value.autobuyers[ak][i].intervalCost = formatValue(getIntervalCostScaling(AutobuyerKind.Matter,i).getCurrentCost(player.autobuyers[ak][i].intervalAmount), NotationName.Default);
      ui.value.autobuyers[ak][i].canBuy = getAutobuyerCostScaling(AutobuyerKind.Matter,i).getCurrentCost(player.autobuyers[ak][i].amount).lte(getCurrency(autobuyerCurrency[ak][i]));
      ui.value.autobuyers[ak][i].canBuyInterval = getIntervalCostScaling(AutobuyerKind.Matter,i).getCurrentCost(player.autobuyers[ak][i].intervalAmount).lte(getCurrency(autobuyerCurrency[ak][i]))
    }
  })
}
export function input(type: string,args: Array<string>){
  if(type==="ClickMatterButton") player.matter=player.matter.add(1);
  if(type==="ClickDeflationPowerButton") player.deflationPower=player.deflationPower.add(1);
  if(type==="ChangeTab") ui.value.tab = args[0];
  if(type==="ChangeSubtab") ui.value.subtab = args[0];
}