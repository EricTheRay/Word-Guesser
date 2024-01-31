<script setup lang="ts">
import { useGameStateStore } from '@/stores/GameStateStore';
import { useMessageBubbles } from '@/composables/MessageBubblesStore';
import ToggleButton from '@/components/ToggleButton.vue';

const props = defineProps<{
  showModal: boolean
}>();

const emit = defineEmits<{
  (e: 'toggle-modal'): void
}>();

const gameState = useGameStateStore();

const messageBubbles = useMessageBubbles('bubbles-0');

const toggleHardMode = function(): void {
  const message = gameState.toggleHardMode();

  if (message !== "OK")
    messageBubbles.push(message, 3000);

  return;
};

const toggleDarkTheme = function(): void {
  gameState.toggleDarkTheme();

  return;
}

const toggleHighContrast = function(): void {
  gameState.toggleHighContrast();

  return;
}

</script>

<template>
  <div>
    <TransitionGroup 
      enter-from-class="opacity-0" 
      enter-to-class="opacity-100" 
      enter-active-class="transition-all duration-[0.1s] ease-linear" 
      leave-from-class="opacity-100" 
      leave-to-class="opacity-0" 
      leave-active-class="transition-all duration-[0.1s] ease-linear" 
    >
      <div 
        v-if="props.showModal"
        class="fixed min-w-full min-h-screen bg-background/50"
        v-on:click="(event) => emit('toggle-modal')"
      ></div>
    </TransitionGroup>

    <TransitionGroup 
      enter-from-class="opacity-0 translate-y-4" 
      enter-to-class="opacity-100 translate-y-0" 
      enter-active-class="transition-all duration-[0.1s] ease-linear" 
      leave-from-class="opacity-100 translate-y-0" 
      leave-to-class="opacity-0 translate-y-4" 
      leave-active-class="transition-all duration-[0.1s] ease-linear" 
    >
      <div v-if="props.showModal === true" class="fixed mx-[30%] mt-[10%] w-[40%] min-w-max p-4 bg-sub rounded-xl shadow-lg">
        <div class="flex flex-col space-y-4">
          <div class="grid grid-cols-4">
            <div class="flex"></div>
            <div class="col-span-2 flex justify-center items-center font-inter text-xl font-bold text-positive">
              Settings
            </div>
            <div class="flex justify-end items-center">
              <button type="button" v-on:click="(event) => emit('toggle-modal')">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path class="fill-positive" d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
              </button>
            </div>
          </div>
          <div class="flex flex-col space-y-3">
            <div class="flex">
              <div class="flex flex-auto justify-start font-inter text-lg text-positive">
                Hard Mode
              </div>
              <div class="flex flex-auto justify-end items-center max-w-max">
                <ToggleButton 
                  v-bind:value="gameState.isHardMode" 
                  v-bind:enabled="gameState.rowIndex === 0 || gameState.isHardMode === true" 
                  v-bind:styles="{ dimensions: { width: '40px', height: '20px', margin: '2px' }, 
                                   colors: { bgColorClassInactive: 'bg-inactive', bgColorClassActive: 'bg-active', buttonColorClass: 'bg-white' } }"
                  v-on:toggle="(value) => toggleHardMode()" 
                />
              </div>
            </div>
            <div class="flex">
              <div class="flex flex-auto justify-start font-inter text-lg text-positive">
                Dark Theme
              </div>
              <div class="flex flex-auto justify-end items-center max-w-max">
                <ToggleButton 
                  v-bind:value="gameState.isDarkTheme" 
                  v-bind:enabled="true" 
                  v-bind:styles="{ dimensions: { width: '40px', height: '20px', margin: '2px' }, 
                                   colors: { bgColorClassInactive: 'bg-inactive', bgColorClassActive: 'bg-active', buttonColorClass: 'bg-white' } }"
                  v-on:toggle="(value) => toggleDarkTheme()" 
                />
              </div>
            </div>
            <div class="flex">
              <div class="flex flex-auto justify-start font-inter text-lg text-positive">
                High Contrast Mode
              </div>
              <div class="flex flex-auto justify-end items-center max-w-max">
                <ToggleButton 
                  v-bind:value="gameState.isHighContrast" 
                  v-bind:enabled="true" 
                  v-bind:styles="{ dimensions: { width: '40px', height: '20px', margin: '2px' }, 
                                   colors: { bgColorClassInactive: 'bg-inactive', bgColorClassActive: 'bg-active', buttonColorClass: 'bg-white' } }"
                  v-on:toggle="(value) => toggleHighContrast()" 
                />
              </div>
            </div>
            <hr>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>