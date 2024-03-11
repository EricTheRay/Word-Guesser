<script setup lang="ts">
const props = defineProps<{
  value?: string, 
  status?: string, 
  classList?: Array<string>
}>();

const emit = defineEmits<{
  (e: 'key-click', value?: string): void
}>();

const handleClick = function(): void {
  emit('key-click', props.value);
};

const getKeyDynamicClass = function(): Array<string> {
  const classList: Array<string> = [...props.classList || []];

  if (props.status === undefined || props.status === 'available') {
    classList.push('bg-available');
    classList.push('text-positive');
  }
  else if (props.status === 'correct') {
    classList.push('bg-correct');
    classList.push('text-flipped-colored');
  }
  else if (props.status === 'present') {
    classList.push('bg-present');
    classList.push('text-flipped-colored');
  }
  else if (props.status === 'absent') {
    classList.push('bg-absent');
    classList.push('text-flipped-uncolored');
  }

  return classList;
}
</script>

<template>
  <div>
    <button type="button" 
      class="w-full h-full flex justify-center items-center font-inter font-bold rounded-lg text-sm sm:text-base" 
      v-bind:class="getKeyDynamicClass()" 
      v-on:keydown.enter.prevent="" 
      v-on:click.prevent="(event) => handleClick()" 
    >
      <slot name="key"></slot>
    </button>
  </div>
</template>
