<script setup lang="ts">
import { ref, reactive, watch, watchEffect } from 'vue';
import type { Ref } from 'vue';
import { forceReflow } from '@/composables/Animations';

const props = defineProps<{
  value: boolean, 
  enabled: boolean, 
  styles: {
    dimensions?: {
      width?: string, 
      height?: string, 
      margin?: string
    }
    colors?: {
      bgColorClassInactive?: string, 
      bgColorClassActive?: string, 
      buttonColorClass?: string
    }
  }
}>();

const styles = reactive(
  {
    '--toggle-button-width': props.styles.dimensions?.width || '40px', 
    '--toggle-button-height': props.styles.dimensions?.height || '20px', 
    '--toggle-button-margin': props.styles.dimensions?.margin || '2px'
  }
);

const bgColorClassInactive: Ref<string> = ref(props.styles.colors?.bgColorClassInactive || 'bg-gray-500');

const bgColorClassActive: Ref<string> = ref(props.styles.colors?.bgColorClassActive || 'bg-green-500');

const buttonColorClass: Ref<string> = ref(props.styles.colors?.buttonColorClass || 'bg-white');

watch(
  () => props.styles.dimensions?.width, 
  () => {
    styles['--toggle-button-width'] = props.styles.dimensions?.width || '40px';
  }
);

watch(
  () => props.styles.dimensions?.height, 
  () => {
    styles['--toggle-button-height'] = props.styles.dimensions?.height || '20px';
  }
);

watch(
  () => props.styles.dimensions?.margin, 
  () => {
    styles['--toggle-button-margin'] = props.styles.dimensions?.margin || '2px';
  }
);

watch(
  () => props.styles.colors?.bgColorClassInactive, 
  () => {
    bgColorClassInactive.value = props.styles.colors?.bgColorClassInactive || 'bg-gray-500';
  }
);

watch(
  () => props.styles.colors?.bgColorClassActive, 
  () => {
    bgColorClassActive.value = props.styles.colors?.bgColorClassActive || 'bg-green-500';
  }
);

watch(
  () => props.styles.colors?.buttonColorClass, 
  () => {
    buttonColorClass.value = props.styles.colors?.bgColorClassActive || 'bg-white';
  }
);

const getBackgroundClass = function(): Array<string> {
  const classList: Array<string> = [];

  if (props.enabled === false)
    classList.push('bg-opacity-50');
  
  if (props.value === true)
    classList.push(bgColorClassActive.value);

  else
    classList.push(bgColorClassInactive.value);

  return classList;
};

const getButtonClass = function(): Array<string> {
  const classList: Array<string> = [buttonColorClass.value];

  if (props.enabled === false)
    classList.push('bg-opacity-90');

  if (props.value === true)
    classList.push('translate-circle');

  return classList;
};

const emit = defineEmits<{
  (e: 'toggle'): void
}>();

const handleToggle = function(): void {
  emit('toggle');
}
</script>

<template>
  <div>
    <div 
      class="flex items-center w-groove h-groove rounded-full transition-all duration-[0.1s] ease-linear hover:cursor-pointer" 
      v-bind:class="getBackgroundClass()"
      v-bind:style="styles"
      v-on:click="(event) => handleToggle()"
    >
      <div 
        class="m-circle w-circle h-circle rounded-full transition-all duration-[0.1s] ease-linear"
        v-bind:class="getButtonClass()"
      ></div>
    </div>
  </div>
</template>

<style>
.w-groove {
  width: var(--toggle-button-width);
}

.h-groove {
  height: var(--toggle-button-height);
}

.w-circle {
  width: calc(var(--toggle-button-height) - 2 * var(--toggle-button-margin));
}

.h-circle {
  height: calc(var(--toggle-button-height) - 2 * var(--toggle-button-margin));
}

.m-circle {
  margin: var(--toggle-button-margin);
}

.translate-circle {
  transform: translateX(calc(var(--toggle-button-width) - var(--toggle-button-height)));
}
</style>
