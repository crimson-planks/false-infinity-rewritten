<script setup lang="ts">
import { handleInput, texts, type TabName,type SubtabName } from '@/ui';
const props = defineProps<{tab: TabName, subtab: SubtabName, data: {visible: boolean}}>();

function ChangeSubtab(subtab: SubtabName){
  handleInput("ChangeSubtab",[subtab]);
}
</script>
<template>
  <button v-show="data.visible" @click="ChangeSubtab(props.subtab)">{{ texts['en-US'].tabs[tab].subtab[subtab].name }}</button>
</template>
<style>

</style>