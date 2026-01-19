<script setup lang="ts">
import { input, tabs, type TabName,type SubtabName } from '@/ui';
const props = defineProps<{tab: TabName, subtab: SubtabName, data: {visible: boolean}}>();

function ChangeSubtab(subtab: SubtabName){
  input("ChangeSubtab",[subtab]);
}
</script>
<template>
  <button v-show="data.visible" @click="ChangeSubtab(props.subtab)">{{ tabs[tab].subtab[subtab].name }}</button>
</template>
<style>

</style>