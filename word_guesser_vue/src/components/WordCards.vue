<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import type { Ref } from 'vue';
import { useGameStateStore } from '@/stores/GameStateStore';
import { animateClass, ClassAndStyleList } from '@/composables/Animations';

/* Data and Initialization */

const gameState = useGameStateStore();

const wordCardElements: Array<HTMLElement | null> = reactive(
  [null, null, null, null, null, null]
);

const letterCardElements: Array<Array<HTMLElement | null>> = reactive(
  [
    [null, null, null, null, null], 
    [null, null, null, null, null], 
    [null, null, null, null, null], 
    [null, null, null, null, null], 
    [null, null, null, null, null], 
    [null, null, null, null, null]
  ]
);

onMounted(() => {
  for (let i = 0; i < 6; ++i) {
    wordCardElements[i] = document.querySelector(`#word-card-${i}`);
    for (let j = 0; j < 5; ++j) {
      letterCardElements[i][j] = document.querySelector(`#word-card-${i} #letter-${j}`);
    }
  }
});

/* Classes and Styling */

const getLetterCardClass = function(rowIndex:number, colIndex: number): Array<string> {
  const classList: Array<string> = [];

  if (gameState.isFlipped[rowIndex][colIndex] === false) {
    if (gameState.guessList[rowIndex][colIndex] === ' ') {
      classList.push('border-empty');
    }
    else {
      classList.push('border-inserted');
    }
    
    classList.push('text-positive');
  }
  else {
    if (gameState.resultList[rowIndex][colIndex] === 'correct') {
      classList.push('bg-correct');
      classList.push('border-correct');
      classList.push('text-flipped-colored');
    }
    else if (gameState.resultList[rowIndex][colIndex] === 'present') {
      classList.push('bg-present');
      classList.push('border-present');
      classList.push('text-flipped-colored');
    }
    else if (gameState.resultList[rowIndex][colIndex] === 'absent') {
      classList.push('bg-absent');
      classList.push('border-absent');
      classList.push('text-flipped-uncolored');
    }
  }

  return classList;
};

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

// const getCardDynamicStyle = function(colIndex: number): Record<string, string> {
//   const styleList: Record<string, string> = { ...letterCardDynamicLists[colIndex].styleList };

//   return styleList;
// };

/* Animation Renderers */

const insertLetter = function(rowIndex: number, colIndex: number, amplitude: number, duration: number): void {
  animateClass(
    letterCardElements[rowIndex][colIndex]!, 
    duration,  
    'animate-inflate', 
    {
      '--inflate-amplitude': String(amplitude),
      '--inflate-duration': String(duration) + 'ms'
    }
  );

  return;
};

const eraseLetter = function(rowIndex: number, colIndex: number): void {
  return;
};

const shiverCard = function(rowIndex: number, amplitude: string, duration: number): void {
  animateClass(
    wordCardElements[rowIndex]!, 
    duration, 
    'animate-shiver', 
    {
      '--shiver-amplitude': amplitude,
      '--shiver-duration': String(duration) + 'ms'
    }
  );
};

const flipCard = function(rowIndex: number, duration: number, increment: number) {

  const flipLetterCard = function(colIndex: number) {

    if (colIndex === 5)
      return;

    animateClass(
      letterCardElements[rowIndex][colIndex]!, 
      duration, 
      'animate-flip-x', 
      {
        '--flip-duration': String(duration) + 'ms'
      }
    );

    setTimeout(
      () => {
        gameState.flip(rowIndex, colIndex);
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

const bounceCard = function(rowIndex: number, amplitude: string, duration: number, increment: number): void {

  const bounceLetterCard = function(colIndex: number) {

    if (colIndex === 5)
      return;

    animateClass(
      letterCardElements[rowIndex][colIndex]!, 
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
  <div class="">
    <div class="w-full h-full sm:w-auto sm:h-auto sm:max-h-none flex flex-col space-y-[1.5%] sm:space-y-2">
      <div
        v-for="i in [0, 1, 2, 3, 4, 5]"
        v-bind:id="`word-card-${i}`"
        class="flex w-full h-[16%] sm:h-auto justify-center"
      >
        <div class="flex justify-center w-full max-w-[280px] sm:max-w-none space-x-[2%] sm:space-x-2">
          <div
            class="w-[18%] h-full sm:w-auto sm:h-auto"
            v-for="j in [0, 1, 2, 3, 4]"
            v-bind:id="`letter-${j}`"
          >
            <div
              class="flex justify-center items-center font-inter font-bold text-3xl w-full h-full sm:w-12 sm:h-12 border-2" 
              v-bind:class="getLetterCardClass(i, j)"
            >
              {{ gameState.guessList[i][j] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>