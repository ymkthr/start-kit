<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">{{ title }}</h1>
    <slot />
    <div class="text-center mt-6">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>