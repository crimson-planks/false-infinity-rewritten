<script setup lang="ts">
import { input, tabs, type TabName,type SubtabName } from '@/ui';
const props = defineProps<{tab: TabName, subtab: SubtabName}>();

function ChangeSubtab(subtab: SubtabName){
  input("ChangeSubtab",[subtab]);
}
</script>
<template>
  <button @click="ChangeSubtab(props.subtab)">{{ tabs[tab].subtab[subtab] }}</button>
</template>
<style>

</style>