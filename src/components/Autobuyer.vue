<script setup lang="ts">
import { BuyAutobuyer, BuyInterval, ToggleAutobuyer } from '@/autobuyer';
import Decimal from 'break_eternity.js';
import { autobuyerOptions, getBuyableClassBinding, input, type AutobuyerVisualData } from '@/ui';
import { computed } from 'vue';

const props = defineProps<{data: AutobuyerVisualData}>();
function ClickBuyAutobuyerButton(){
  BuyAutobuyer(props.data.loc, Decimal.dOne);
}
function ClickBuyIntervalButton(){
  BuyInterval(props.data.loc, Decimal.dOne)
}
function ClickToggleButton(){
  ToggleAutobuyer(props.data.loc);
}
const autobuyerSelectId = computed(()=>`autobuyer-${props.data.loc.kind}-${props.data.loc.ord}-select`)

</script>
<template>
  <div class="c-autobuyer" v-show="data.visible">
    <span class="c-autobuyer-name">{{ props.data.name }}</span>
    <span class="c-autobuyer-text">Amount: {{ props.data.amount }}</span>
    <button class="c-autobuyer-text" :class="getBuyableClassBinding(props.data.canBuy)" @click="ClickBuyAutobuyerButton">Cost: {{ props.data.cost }}</button>
    <span class="c-autobuyer-text">Interval: {{ props.data.interval }}</span>
    <button class="c-autobuyer-text" :class="getBuyableClassBinding(props.data.canBuyInterval)" @click="ClickBuyIntervalButton">Interval Cost: {{ props.data.intervalCost }}</button>
    <span class="c-autobuyer-text">Timer: {{ props.data.timer }}</span>
    <button class="c-autobuyer-text" @click="ClickToggleButton()">Toggle: {{ props.data.toggle }}</button>
  </div>
</template>
<style>
.c-autobuyer-name{
  text-align: center;
}
.c-autobuyer{
  min-width: 250px;
  width:fit-content;
  display: grid;
  justify-items:stretch;
}
.c-autobuyer-text{
  padding: 0px;
  background-color: white;
  text-align: left;
  height: 1.1em;
  border: 1px solid black;
}
</style>