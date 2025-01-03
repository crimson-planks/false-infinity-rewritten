import { ref } from "vue";
import { player } from "./player";
import { formatValue, NotationName } from '@/notation'
import { AutobuyerKind } from "./autobuyer";
export interface AutobuyerVisualData{
  kind: AutobuyerKind;
  ord: number;
  amount: string;
  timer: string;
  interval: string;
  cost: string;
}
export const ui = ref({
  matter: "0",
  autobuyers: {
    matter: [
      {
        kind: AutobuyerKind.Matter,
        ord: 0,
        amount: "0",
        timer: "0",
        interval: "",
        cost: "10"
      }
    ]
  }
})
export function updateScreen(){
  ui.value.matter=formatValue(player.matter, NotationName.Default);
  ui.value.autobuyers.matter[0].kind = player.autobuyers.matter[0].kind;
  ui.value.autobuyers.matter[0].ord = player.autobuyers.matter[0].ord;
  ui.value.autobuyers.matter[0].amount = formatValue(player.autobuyers.matter[0].amount, NotationName.Default);
  ui.value.autobuyers.matter[0].timer = formatValue(player.autobuyers.matter[0].timer, NotationName.Default);
  ui.value.autobuyers.matter[0].interval = formatValue(player.autobuyers.matter[0].interval, NotationName.Default);
  ui.value.autobuyers.matter[0].cost = formatValue(player.autobuyers.matter[0].costScaling.getCurrentCost(player.autobuyers.matter[0].amount), NotationName.Default);
}
export function input(type: string,args: Array<string>){
  if(type==="ClickMatterButton") player.matter=player.matter.add(1);
}