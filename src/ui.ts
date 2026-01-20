//TODO: make tabs and subtabs
import { ref } from "vue";
import { player } from "./player";
import { formatValue, NotationName } from '@/notation'
import { getAutobuyerCostScaling, AutobuyerKind, getIntervalCostScaling, autobuyerCurrency, autobuyerName, intervalCurrency } from "./autobuyer";
import { canDeflate, deflationCost, deflationSacrifice, overflow } from "./prestige";
import { gameCache } from "./cache";
import { CurrencyName, getCurrency } from "./currency";
import { getMatterPerSecond } from "./main";
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
export type TabName = "autobuyer" | "overflow" | "option"
export type SubtabName = "matter" | "deflation" | "upgrades"
export const tabs: {
  [key: string]: {
    name: string,
    subtab: {
      [key: string]: {
        name: string
      }
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
  overflow: {
    name: "Overflow",
    subtab:{
      upgrades: {
        name: "Upgrades"
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
  tabs: {
    autobuyer: {
      visible: true
    },
    overflow:{
      visible: true
    },
    option: {
      visible: true
    }
  },
  subtab: "matter",
  subtabs: {
    autobuyer: {
      matter: {
        visible: true
      },
      deflation: {
        visible: false
      }
    },
    overflow: {
      upgrades: {
        visible: true
      }
    },
    option: {
      option:{
        visible: true
      }
    }
  },
  creditsVisible: false,
  matter: "0",
  matterPerSecond: "0",
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
  canDeflate: false,
  deflationPower: "",
  translatedDeflationPower: "",
  deflationPowerBoostWhenSacrifice: "",
  previousSacrificeDeflationPower: "",
  deflationPowerBoostBySacrificedDeflationPower: "",
  deflator: "",
  isOverflowing: false,
  overflowPoint: "",
})
export function updateScreen(){
  ui.value.matter=formatValue(player.matter, NotationName.Default);
  ui.value.matterPerSecond=formatValue(getMatterPerSecond(), NotationName.Default);
  ui.value.deflationCost=formatValue(deflationCost.getCurrentCost(player.deflation), NotationName.Default);
  ui.value.canDeflate=canDeflate();
  ui.value.deflationPower = formatValue(player.deflationPower, NotationName.Default);
  ui.value.translatedDeflationPower = formatValue(gameCache.translatedDeflationPower.cachedValue, NotationName.Default);
  ui.value.previousSacrificeDeflationPower = formatValue(player.previousSacrificeDeflationPower, NotationName.Default)
  ui.value.deflationPowerBoostWhenSacrifice = formatValue(gameCache.deflationPowerBoostWhenSacrifice.cachedValue, NotationName.Default)
  ui.value.deflationPowerBoostBySacrificedDeflationPower = formatValue(gameCache.deflationPowerBoostBySacrificedDeflationPower.cachedValue, NotationName.Default)
  ui.value.deflator = formatValue(player.deflator, NotationName.Default);
  ui.value.isOverflowing = player.isOverflowing;
  ui.value.overflowPoint = formatValue(player.overflowPoint, NotationName.Default);
  ui.value.tabs.overflow.visible = player.overflow.gt(0);
  ui.value.subtabs.autobuyer.deflation.visible=player.deflation.gt(0);
  //@ts-ignore: this is a valid way of iterating through an Object
  Object.keys(player.autobuyers).forEach((ak: AutobuyerKind)=>{
    for(let i=0;i<player.autobuyers[ak].length;i++){
      ui.value.autobuyers[ak][i].kind = player.autobuyers[ak][i].kind;
      ui.value.autobuyers[ak][i].ord = player.autobuyers[ak][i].ord;
      ui.value.autobuyers[ak][i].amount = formatValue(player.autobuyers[ak][i].amount, NotationName.Default);
      ui.value.autobuyers[ak][i].timer = formatValue(player.autobuyers[ak][i].timer, NotationName.Default);
      ui.value.autobuyers[ak][i].interval = formatValue(player.autobuyers[ak][i].interval, NotationName.Default);
      ui.value.autobuyers[ak][i].toggle = player.autobuyers[ak][i].toggle ? "On" : "Off";
      ui.value.autobuyers[ak][i].cost = formatValue(getAutobuyerCostScaling(ak,i).getCurrentCost(player.autobuyers[ak][i].amount), NotationName.Default) + " " + CurrencyName[autobuyerCurrency[ak][i]];
      ui.value.autobuyers[ak][i].intervalCost = formatValue(getIntervalCostScaling(ak,i).getCurrentCost(player.autobuyers[ak][i].intervalAmount), NotationName.Default) + " " + CurrencyName[intervalCurrency[ak][i]];
      ui.value.autobuyers[ak][i].canBuy = getAutobuyerCostScaling(ak,i).getCurrentCost(player.autobuyers[ak][i].amount).lte(getCurrency(autobuyerCurrency[ak][i]));
      ui.value.autobuyers[ak][i].canBuyInterval = getIntervalCostScaling(ak,i).getCurrentCost(player.autobuyers[ak][i].intervalAmount).lte(getCurrency(autobuyerCurrency[ak][i]));
    }
  })
}
export function input(type: string,args: Array<string>){
  if(type==="ClickMatterButton") player.matter=player.matter.add(1);
  if(type==="ClickDeflationPowerButton") player.deflationPower=player.deflationPower.add(1);
  if(type==="ClickDeflationSacrificeButton") deflationSacrifice();
  if(type==="ClickOverflowButton") overflow()
  if(type==="ChangeTab") ui.value.tab = args[0];
  if(type==="ChangeSubtab") ui.value.subtab = args[0];
}