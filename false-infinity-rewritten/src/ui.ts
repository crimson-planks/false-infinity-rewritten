import { ref } from "vue";
import { player } from "./player";
import { formatValue, NotationName } from '@/notation'
import { autobuyerCostScaling, AutobuyerKind, intervalCostScaling } from "./autobuyer";
import { deflationCost } from "./prestige";
export interface AutobuyerVisualData{
  kind: AutobuyerKind;
  ord: number;
  amount: string;
  timer: string;
  interval: string;
  cost: string;
  intervalCost: string;
}
export const ui = ref({
  matter: "0",
  deflationCost: "",
  autobuyers: {
    matter: Array(2).fill(0).map(()=>{return {
      kind: AutobuyerKind.Matter,
      ord: 0,
      amount: "0",
      timer: "0",
      interval: "",
      cost: "10",
      intervalCost: "",
    }})
  }
})
export function updateScreen(){
  ui.value.matter=formatValue(player.matter, NotationName.Default);
  ui.value.deflationCost=formatValue(deflationCost.getCurrentCost(player.deflation), NotationName.Default);
  for(let i=0;i<player.autobuyers.matter.length;i++){
    ui.value.autobuyers.matter[i].kind = player.autobuyers.matter[i].kind;
    ui.value.autobuyers.matter[i].ord = player.autobuyers.matter[i].ord;
    ui.value.autobuyers.matter[i].amount = formatValue(player.autobuyers.matter[i].amount, NotationName.Default);
    ui.value.autobuyers.matter[i].timer = formatValue(player.autobuyers.matter[i].timer, NotationName.Default);
    ui.value.autobuyers.matter[i].interval = formatValue(player.autobuyers.matter[i].interval, NotationName.Default);
    ui.value.autobuyers.matter[i].cost = formatValue(autobuyerCostScaling.matter[i].getCurrentCost(player.autobuyers.matter[i].amount), NotationName.Default);
    ui.value.autobuyers.matter[i].intervalCost = formatValue(intervalCostScaling.matter[i].getCurrentCost(player.autobuyers.matter[i].intervalAmount), NotationName.Default);
  }
}
export function input(type: string,args: Array<string>){
  if(type==="ClickMatterButton") player.matter=player.matter.add(1);
}