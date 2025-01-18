<script setup lang="ts">
import { input, type SubtabName } from '@/ui';
const props = defineProps<{subtab: SubtabName}>();

function ChangeSubtab(subtab: SubtabName){
  input("ChangeSubtab",[subtab]);
}
</script>
<template>
  <button @click="ChangeSubtab(props.subtab)">{{ props.subtab }}</button>
</template>