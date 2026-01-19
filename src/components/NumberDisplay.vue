<script setup lang="ts">
import Decimal from '@/lib/break_eternity.js';
import { NotationName, formatValue } from '@/notation';
import { computed } from 'vue';
const props = defineProps<{ number: Decimal; notation: NotationName }>();

const formattedValue = computed(() => formatValue(props.number, props.notation));
</script>

<template>
  {{ formattedValue }}
</template>
