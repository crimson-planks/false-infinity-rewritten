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
  <div class="autobuyer">
    Amount: {{ props.data.amount }}<br />
    <button @click="ClickBuyAutobuyerButton">Cost: {{ props.data.cost }}</button><br />
    Interval: {{ props.data.interval }}<br />
    <button @click="ClickBuyIntervalButton">Interval Cost: {{ props.data.intervalCost }}</button><br />
    Timer: {{ props.data.timer }}
  </div>
</template>
<style>
.autobuyer{
  min-width: 100px;
  width: max-content;
  border: 1px solid black;
}
</style>