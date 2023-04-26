<template>
  <h1 @click="emit('back')">添加属性</h1>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  const emit = defineEmits('back')
</script>

<style lang="less" scoped></style>
