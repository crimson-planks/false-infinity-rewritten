<script setup lang="ts">
import { BuyAutobuyer, BuyInterval } from '@/autobuyer';
import Decimal from '@/lib/break_eternity';
import type { AutobuyerVisualData } from '@/ui';

const props = defineProps<{data: AutobuyerVisualData}>();
function ClickBuyAutobuyerButton(){
  BuyAutobuyer(props.data.kind, props.data.ord, Decimal.dOne);
}
function ClickBuyIntervalButton(){
  BuyInterval(props.data.kind, props.data.ord, Decimal.dOne)
}
</script>
<template>
  <div class="c-autobuyer">
    <span class="c-autobuyer-name">{{ props.data.name }}</span>
    <span class="c-autobuyer-text">Amount: {{ props.data.amount }}</span>
    <span class="c-autobuyer-text" @click="ClickBuyAutobuyerButton">Cost: {{ props.data.cost }}</span>
    <span class="c-autobuyer-text">Interval: {{ props.data.interval }}</span>
    <span class="c-autobuyer-text" @click="ClickBuyIntervalButton">Interval Cost: {{ props.data.intervalCost }}</span>
    <span class="c-autobuyer-text">Timer: {{ props.data.timer }}</span>
  </div>
</template>
<style>
.c-autobuyer-name{
  text-align: center;
}
.c-autobuyer{
  min-width: 250px;
  width: fit-content;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  justify-items: stretch;
}
.c-autobuyer-text{
  height: 1em;
  border: 1px solid black;
}
</style>