<script setup lang="ts">
import { BuyAutobuyer, BuyInterval, ToggleAutobuyer } from '@/autobuyer';
import Decimal from 'break_eternity.js';
import { autobuyerOptions, input, selectedOrdArray, type AutobuyerVisualData } from '@/ui';
import { computed } from 'vue';

const props = defineProps<{data: AutobuyerVisualData}>();
function ClickBuyAutobuyerButton(){
  BuyAutobuyer(props.data.kind, props.data.ord, Decimal.dOne);
}
function ClickBuyIntervalButton(){
  BuyInterval(props.data.kind, props.data.ord, Decimal.dOne)
}
function ClickToggleButton(){
  ToggleAutobuyer(props.data.kind, props.data.ord);
}
const autobuyerSelectId = computed(()=>`autobuyer-${props.data.kind}-${props.data.ord}-select`)
</script>
<template>
  <div class="c-autobuyer">
    <span class="c-autobuyer-name">{{ props.data.name }}</span>
    <span class="c-autobuyer-text">Amount: {{ props.data.amount }}</span>
    <span class="c-autobuyer-text" :class="{ 'button--can-buy': props.data.canBuy, 'button--cannot-buy': !props.data.canBuy}" @click="ClickBuyAutobuyerButton">Cost: {{ props.data.cost }}</span>
    <span class="c-autobuyer-text">Interval: {{ props.data.interval }}</span>
    <span class="c-autobuyer-text" :class="{ 'button--can-buy': props.data.canBuyInterval, 'button--cannot-buy': !props.data.canBuyInterval}" @click="ClickBuyIntervalButton">Interval Cost: {{ props.data.intervalCost }}</span>
    <span class="c-autobuyer-text">Timer: {{ props.data.timer }}</span>
    <span v-show="props.data.hasOption">
      <label :for="autobuyerSelectId">
selectedOrd:
    </label>
    <select :id="autobuyerSelectId" v-model="input.autobuyerOption.matterAutobuyer[0].selectedOrd">
      <option v-for="selectedOrd in autobuyerOptions.matterAutobuyer[0]">{{ selectedOrd }}</option>
    </select>
  </span>
    <span class="c-autobuyer-text" @click="ClickToggleButton()">Toggle: {{ props.data.toggle }}</span>
  </div>
</template>x
<style>
.c-autobuyer-name{
  text-align: center;
}
.c-autobuyer{
  min-width: 250px;
  width: fit-content;
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  justify-items: stretch;
}
.c-autobuyer-text{
  height: 1em;
  border: 1px solid black;
}
</style>