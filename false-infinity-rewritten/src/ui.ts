import { ref } from "vue";
import { player } from "./player";
import { formatValue, NotationName } from '@/notation'
import { getAutobuyerCostScaling, AutobuyerKind, getIntervalCostScaling } from "./autobuyer";
import { deflationCost } from "./prestige";
import { gameCache } from "./cache";
export interface AutobuyerVisualData{
  kind: AutobuyerKind;
  ord: number;
  amount: string;
  timer: string;
  interval: string;
  cost: string;
  intervalCost: string;
}
export type TabName = "autobuyers"
export type SubtabName = "matter" | "deflation"
export const ui = ref({
  tab: "autobuyers",
  subtab: "matter",
  matter: "0",
  deflationCost: "",
  autobuyers: {
    matter: Array(player.autobuyers.matter.length).fill(0).map(()=>{return {
      kind: AutobuyerKind.Matter,
      ord: 0,
      amount: "0",
      timer: "0",
      interval: "",
      cost: "10",
      intervalCost: "",
    }})
  },
  deflationPower: "",
  translatedDeflationPower: "",
})
export function updateScreen(){
  ui.value.matter=formatValue(player.matter, NotationName.Default);
  ui.value.deflationCost=formatValue(deflationCost.getCurrentCost(player.deflation), NotationName.Default);
  ui.value.deflationPower = formatValue(player.deflationPower, NotationName.Default);
  ui.value.translatedDeflationPower = formatValue(gameCache.translatedDeflationPower.cachedValue, NotationName.Default);
  for(let i=0;i<player.autobuyers.matter.length;i++){
    ui.value.autobuyers.matter[i].kind = player.autobuyers.matter[i].kind;
    ui.value.autobuyers.matter[i].ord = player.autobuyers.matter[i].ord;
    ui.value.autobuyers.matter[i].amount = formatValue(player.autobuyers.matter[i].amount, NotationName.Default);
    ui.value.autobuyers.matter[i].timer = formatValue(player.autobuyers.matter[i].timer, NotationName.Default);
    ui.value.autobuyers.matter[i].interval = formatValue(player.autobuyers.matter[i].interval, NotationName.Default);
    ui.value.autobuyers.matter[i].cost = formatValue(getAutobuyerCostScaling(AutobuyerKind.Matter,i).getCurrentCost(player.autobuyers.matter[i].amount), NotationName.Default);
    ui.value.autobuyers.matter[i].intervalCost = formatValue(getIntervalCostScaling(AutobuyerKind.Matter,i).getCurrentCost(player.autobuyers.matter[i].intervalAmount), NotationName.Default);
  }
}
export function input(type: string,args: Array<string>){
  if(type==="ClickMatterButton") player.matter=player.matter.add(1);
  if(type==="ClickDeflationPowerButton") player.deflationPower=player.deflationPower.add(1);
  if(type==="ChangeTab") ui.value.tab = args[0];
  if(type==="ChangeSubtab") ui.value.subtab = args[0];
}