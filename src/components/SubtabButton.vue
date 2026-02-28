<script setup lang="ts">
import { texts, type TabName,type SubtabName, inputFunctions, ui } from '@/ui';
import { computed } from 'vue';
const props = defineProps<{tab: TabName, subtab: SubtabName, data: {visible: boolean}}>();

function ChangeSubtab(subtab: SubtabName){
  inputFunctions.ChangeSubtab(subtab)
}
const selected = computed(()=>ui.value.subtabs[props.tab].currentSubtab==props.subtab)
</script>
<template>
  <button class="o-subtab-button" :class="{'o-selected-subtab-button': selected}" v-show="data.visible" @click="ChangeSubtab(props.subtab)">{{ texts['en-US'].tabs[tab].subtab[subtab].name }}</button>
</template>
<style>
.o-subtab-button{
  border: 2px solid #b4ae75;
  background-color: white;
  font-size: 22px;
  margin-right: 2px;
}
.o-subtab-button:hover{
  background-color: #eee16a;
}
.o-selected-subtab-button{
  border-color: black;
  background-color: #afafaf;
}
</style>