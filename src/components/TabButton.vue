<script setup lang="ts">
import { inputFunctions, texts, ui, type TabName } from '@/ui';
import { computed } from 'vue';
const props = defineProps<{tab: TabName; visible: boolean}>();

function ChangeTab(tab: TabName){
  inputFunctions.ChangeTab(tab);
}
const selected = computed(()=>ui.value.currentTab==props.tab)
</script>
<template>
  <button class="o-tab-button" :class="{'o-selected-tab-button': selected}" v-show="visible" @click="ChangeTab(props.tab)">{{ texts['en-US'].tabs[props.tab].name }}</button>
</template>
<style>
.o-tab-button{
  border: 2px solid #42b153;
  background-color: white;
  font-size: 26px;
  margin-right: 10px;
}
.o-tab-button:hover{
  background-color: #42b153;
}
.o-selected-tab-button{
  border-color: black;
  background-color: #afafaf;
}
</style>