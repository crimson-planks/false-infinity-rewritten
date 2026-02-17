<script setup lang="ts">
import Decimal, { type DecimalSource } from 'break_eternity.js';
import { NotationIdEnum, formatValue } from '@/notation';
import { computed } from 'vue';
const props = defineProps<{ number: DecimalSource; notation: NotationIdEnum }>();

const formattedValue = computed(() => formatValue(props.number, props.notation));
</script>

<template>
  {{ formattedValue }}
</template>
