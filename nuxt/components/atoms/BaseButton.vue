<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded transition-colors',
      variantClasses,
      sizeClasses,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    :type="type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-500 text-white hover:bg-blue-600'
    case 'secondary':
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600'
    case 'success':
      return 'bg-green-500 text-white hover:bg-green-600'
    default:
      return 'bg-blue-500 text-white hover:bg-blue-600'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'py-1 px-3 text-sm'
    case 'md':
      return 'py-2 px-4 text-base'
    case 'lg':
      return 'py-3 px-6 text-lg'
    default:
      return 'py-2 px-4 text-base'
  }
})

defineEmits(['click'])
</script>