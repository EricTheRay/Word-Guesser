<script setup lang="ts">
const props = defineProps<
  {
    message: string
  }
>();
</script>

<template>
  <div class="flex justify-center">
    <div class="text-center font-inter text-lg font-semibold text-white rounded-xl bg-black p-2">
      {{ props.message }}
    </div>
  </div>
</template>