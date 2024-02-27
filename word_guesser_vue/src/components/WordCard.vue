<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import type { Ref } from 'vue';
import { useGameStateStore } from '@/stores/GameStateStore';
import { animateClass, ClassAndStyleList } from '@/composables/Animations';

/* Props */

const props = defineProps<{
  rowIndex: number
}>();

/* Data and Initialization */

const gameState = useGameStateStore();

const containerElement: Ref<HTMLElement | null> = ref(null);

const letterCardElements: Array<HTMLElement | null> = reactive(
  [null, null, null, null, null]
);

const letterCardDynamicLists: Array<ClassAndStyleList> = reactive(
  [new ClassAndStyleList(), new ClassAndStyleList(), new ClassAndStyleList(), new ClassAndStyleList(), new ClassAndStyleList()]
);

onMounted(() => {
  containerElement.value = document.querySelector(`#word-card-${props.rowIndex}`);

  for (let i: number = 0; i < 5; ++i)
    letterCardElements[i] = document.querySelector(`#word-card-${props.rowIndex} #letter-${i}`);
});

/* Animation Renderers */

// const addToDynamicList = function(list: ClassAndStyleList, duration: number, dynamicCLass: string, dynamicStyles: Record<string, string>): void {
  
//   list.classList.push(dynamicCLass);

//   for (const [key, value] of Object.entries(dynamicStyles)) {
//     list.styleList[key] = value;
//   }

//   setTimeout(
//     () => {
//       list.classList.splice(list.classList.indexOf(dynamicCLass), 1);

//       for (const [key, value] of Object.entries(dynamicStyles)) {
//         delete list.styleList[key];
//       }
//     }, 
//     duration
//   );
// };

const insertLetter = function(idx: number, amplitude: number, duration: number): void {
  animateClass(
    letterCardElements[idx]!, 
    duration,  
    'animate-inflate', 
    {
      '--inflate-amplitude': String(amplitude),
      '--inflate-duration': String(duration) + 'ms'
    }
  );

  return;
};

const eraseLetter = function(idx: number): void {
  return;
};

for (let i = 0; i < 5; ++i) {
  watch(
    () => gameState.guessList[props.rowIndex][i], 
    (newValue) => {
      if (newValue !== ' ')
        insertLetter(i, 1.05, 100);

      else
        eraseLetter(i);

      return;
    }
  );
}

const getCardDynamicClass = function(colIndex: number): Array<string> {
  const classList: Array<string> = [];

  if (gameState.isFlipped[props.rowIndex][colIndex] === false) {
    if (gameState.guessList[props.rowIndex][colIndex] === ' ') {
      classList.push('border-empty');
    }
    else {
      classList.push('border-inserted');
    }
    
    classList.push('text-positive');
  }
  else {
    if (gameState.resultList[props.rowIndex][colIndex] === 'correct') {
      classList.push('bg-correct');
      classList.push('border-correct');
      classList.push('text-flipped-colored');
    }
    else if (gameState.resultList[props.rowIndex][colIndex] === 'present') {
      classList.push('bg-present');
      classList.push('border-present');
      classList.push('text-flipped-colored');
    }
    else if (gameState.resultList[props.rowIndex][colIndex] === 'absent') {
      classList.push('bg-absent');
      classList.push('border-absent');
      classList.push('text-flipped-uncolored');
    }
  }

  return classList;
};

const getCardDynamicStyle = function(colIndex: number): Record<string, string> {
  const styleList: Record<string, string> = { ...letterCardDynamicLists[colIndex].styleList };

  return styleList;
};

const shiverCard = function(amplitude: string, duration: number): void {
  animateClass(
    containerElement.value!, 
    duration, 
    'animate-shiver', 
    {
      '--shiver-amplitude': amplitude,
      '--shiver-duration': String(duration) + 'ms'
    }
  );
};

const flipCard = function(duration: number, increment: number) {

  const flipLetterCard = function(colIndex: number) {

    if (colIndex === 5)
      return;

    animateClass(
      letterCardElements[colIndex]!, 
      duration, 
      'animate-flip-x', 
      {
        '--flip-duration': String(duration) + 'ms'
      }
    );

    setTimeout(
      () => {
        gameState.flip(props.rowIndex, colIndex);
      }, 
      duration / 2
    );

    setTimeout(
      () => {
        flipLetterCard(colIndex + 1);
      }, 
      increment
    );
  }

  flipLetterCard(0);

  return;
};

const bounceCard = function(amplitude: string, duration: number, increment: number): void {

  const bounceLetterCard = function(colIndex: number) {

    if (colIndex === 5)
      return;

    animateClass(
      letterCardElements[colIndex]!, 
      duration, 
      'animate-bounce', 
      {
        '--bounce-amplitude': amplitude, 
        '--bounce-duration': String(duration) + 'ms'
      }
    );

    setTimeout(
      () => {
        bounceLetterCard(colIndex + 1);
      }, 
      increment
    );
  }

  bounceLetterCard(0);

  return;
};

defineExpose({
  insertLetter, 
  eraseLetter, 
  shiverCard, 
  flipCard, 
  bounceCard
});
</script>

<template>
  <div class="flex w-full h-full justify-center">
    <div class="flex justify-center w-full max-w-[272px] sm:max-w-none space-x-1 sm:space-x-2">
      <div
        class="w-[15%] h-full sm:w-auto sm:h-auto"
        v-for="i in 5"
        v-bind:key="i"
        v-bind:id="'letter-' + (i - 1)"
      >
        <div 
          class="flex justify-center items-center font-inter font-bold text-3xl w-full h-full sm:w-12 sm:h-12 border-2" 
          v-bind:class="getCardDynamicClass(i - 1)" 
          v-bind:style="getCardDynamicStyle(i - 1)" 
        >
        {{ gameState.guessList[props.rowIndex][i - 1] }}
        </div>
      </div>
    </div>
  </div>
</template>