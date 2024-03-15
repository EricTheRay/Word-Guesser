<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { Ref } from 'vue';
import { onBeforeUnload } from '@/composables/onBeforeUnload';
import { animateClass, forceReflow } from '@/composables/Animations';
import { useGameStateStore } from '@/stores/GameStateStore';
import { useMessageBubbles } from '@/composables/MessageBubblesStore';
import SettingsMenu from '@/components/SettingsMenu.vue';
import WordCards from '@/components/WordCards.vue';
import Keyboard from '@/components/Keyboard.vue';
import MessageBubbles from '@/components/MessageBubbles.vue';
import axios from 'axios';

/* Data and Initilzation */

const showModal: Ref<boolean> = ref(false);

const inputBlocked: Ref<boolean> = ref(false);

const gameState = useGameStateStore();

const grades: Array<string> = ["Genius", "Magnificent", "Impressive", "Splendid", "Great", "Phew"];

const wordCardsRef: Ref<any> = ref(null);

const wordCardElements: Array<HTMLElement | null> = reactive(
  [null, null, null, null, null, null]
);

const BubblesElement: Ref<HTMLElement | null> = ref(null);

const messageBubbles = useMessageBubbles('bubbles-0');

onMounted(async () => {

  inputBlocked.value = true;

  gameState.initializeGameState();

  for (let i = 0; i < gameState.rowIndex; ++i)
    wordCardsRef.value.flipCard(i, 600, 300);

  if (gameState.rowIndex !== 0)
    await wait(2400);

  for (let i = 0; i < gameState.rowIndex; ++i)
    gameState.updateLetterList(gameState.guessList[i], gameState.resultList[i]);
  
  for (let i: number = 0; i < 6; ++i)
    wordCardElements[i] = document.getElementById(`word-card-${i}`);

  addEventListener('keyup', async (event) => {
    handleKeyboardInput(event.key);
  });

  setInterval(
    () => {
      gameState.saveGameStateToStorage();
    }, 
    10000
  );

  inputBlocked.value = false;

  return;
});

/* Utility Functions */

const wait = function(duration: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        resolve();
      }, 
      duration
    );
  });
};

/* Menus and Modals */

const toggleModal = function(): void {
  showModal.value = !showModal.value;

  return;
};

/* Backend Communication */

const submitWord = async function(word: string): Promise<any> {
  let result: any = {};
  
  await axios
    .put(
      'api/submit-word/', 
      { word: word }, 
      { timeout: 3000 }
    )
    .then((response) => {
      result.status = 'submitted';
      result.data = response.data.data;
    })
    .catch((error) => {
      result.status = 'error';
      result.data = error;
    });

  return result;
};

const requestAnswer = async function(): Promise<any> {
  let result: any = {};
  
  await axios
    .get(
      'api/request-answer/', 
      { timeout: 3000 }
    )
    .then((response) => {
      result.status = 'submitted';
      result.data = response.data.data;
    })
    .catch((error) => {
      result.status = 'error';
      result.data = error;
    });
  
  return result;
};

/* Data Manipulation */

/* Input Events and Handlers */

const handleEscape = async function(): Promise<void> {
  if (showModal.value === true)
    showModal.value = false;

  return;
};

const handleWordSubmit = async function(): Promise<void> {

  if (new Date().getTime() - new Date(gameState.date).getTime() >= 86400000) {
    messageBubbles.push("Date changed (Please refresh)", 3000);

    return;
  }

  const validated = gameState.validateGuess();
  
  if (validated.status === 'success') {
    const word = validated.description;
    
    const result = await submitWord(word);

    if (result.status === 'submitted') {
      if (result.data.description === "word not found") {
        wordCardsRef.value.shiverCard(gameState.rowIndex, '10px', 400);
        messageBubbles.push("Word not in dictionary", 3000);
      }
      else if (result.data.description === "word checked") {
        gameState.updateResultList(result.data.result);

        wordCardsRef.value.flipCard(gameState.rowIndex, 600, 300);
        
        await wait(1800);

        gameState.updateLetterList(word, result.data.result);

        gameState.toNextWordCard();
        
        if (gameState.rowIndex === 6) {
          const result = await requestAnswer();

          if (result.status === 'error') {
            messageBubbles.push("An error occurred", 3000);

          }
          else {
            messageBubbles.push(`${result.data.result}`, 3000);
          }
        }
      }
      else if (result.data.description === "correct answer") {
        gameState.updateResultList(result.data.result);
        wordCardsRef.value.flipCard(gameState.rowIndex, 600, 300);
        
        await wait(1800);

        gameState.updateLetterList(word, result.data.result);

        wordCardsRef.value.bounceCard(gameState.rowIndex, '15px', 400, 100);

        await wait(800);

        gameState.toNextWordCard();
        gameState.setComplete();

        messageBubbles.push(grades[gameState.rowIndex - 1], 3000);
      }
      else {
        messageBubbles.push("Unknown description", 3000);
      }
    }
    else if (result.status === 'error') {
      messageBubbles.push("An error occurred", 3000);
    }
    else {
      messageBubbles.push("Unknown status type", 3000);
    }
  }
  else if (validated.status === 'failure') {
    wordCardsRef.value.shiverCard(gameState.rowIndex, '10px', 400);
    messageBubbles.push(validated.description, 3000);
  }

  return;
};

const handleLetterInput = async function(letter: string): Promise<void> {
  const indices = gameState.inputLetter(letter);

  if (indices[0] === -1)
    return;

  wordCardsRef.value.insertLetter(indices[0], indices[1], 1.05, 100);

  return;
};

const handleBackspace = async function(): Promise<void> {
  gameState.eraseLetter();

  return;
};

const handleKeyboardInput = async function(key: string): Promise<void> {
  if (gameState.isComplete === true || inputBlocked.value === true)
    return;

  inputBlocked.value = true;

  if (key === 'Enter') {
    await handleWordSubmit();
  }
  else if (key === 'Escape') {
    await handleEscape();
  }
  else if (key === 'Backspace' || key === 'Delete') {
    await handleBackspace();
  }
  else if (key.length === 1) {
    let asciiCode = key.charCodeAt(0);

    if (asciiCode >= 97 && asciiCode <= 122)
      asciiCode -= 32;

    if (asciiCode >= 65 && asciiCode <= 90)
      await handleLetterInput(String.fromCharCode(asciiCode));
  }

  inputBlocked.value = false;

  return;
}

/* Card Manipulation */

const resetGameState = function(): void {
  if (inputBlocked.value === true)
    return;

  gameState.resetGameState();

  return;
};

/* Animation Renderers */

const shiverCard = function(target: HTMLElement, amplitude: string, duration: number): void {
  animateClass(
    target, 
    duration, 
    'animate-shiver', 
    {
      '--shiver-amplitude': amplitude,
      '--shiver-duration': String(duration) + 'ms'
    }
  );
};

/* Local Storage */

onBeforeUnload(() => {
  gameState.saveGameStateToStorage();
});

/* Miscellaneous */

</script>

<template>
  <div v-bind:class="{ 'theme-light': !gameState.isDarkTheme, 'theme-dark': gameState.isDarkTheme, 'theme-normal-contrast': !gameState.isHighContrast, 'theme-high-contrast': gameState.isHighContrast }" v-cloak>
    <div class="fixed w-full h-full bg-background overflow-clip sm:overflow-auto">
      <SettingsMenu class="fixed w-screen h-screen z-20 pointer-events-none" v-bind:showModal="showModal" v-on:toggle-modal="() => toggleModal()" />

      <div class="py-[2%] sm:py-8 sm:mx-[10%] sm:my-[10%] space-y-[4%] sm:space-y-8 bg-main shadow-sm shadow-gray-600 sm:rounded-xl h-full sm:h-auto">
        <nav class="grid grid-cols-5 px-4 sm:px-8 h-[8%] truncate sm:h-auto">
          <div class="flex"></div>
          <div class="col-span-3 flex justify-center items-center font-merriweather text-2xl sm:text-3xl font-bold text-positive truncate">
            Word Guesser
          </div>
          <div class="flex justify-end items-center">
            <button type="button" class="w-5 h-5 sm:w-6 sm:h-6" v-on:click="(event) => toggleModal()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path class="fill-positive" d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z"/>
              </svg>
            </button>
          </div>
        </nav>

        <main class="flex w-full h-[90%] sm:w-auto sm:h-auto">
          <div class="flex flex-col w-full h-full space-y-[5%] sm:space-y-8">
            <WordCards class="w-full h-[70%] max-h-[336px] sm:h-auto sm:max-h-none" ref="wordCardsRef" />

            <Keyboard class="w-full h-[30%] max-h-[120px] sm:h-auto sm:max-h-none" v-bind:letter-list="gameState.letterList" v-on:key-input="(key) => handleKeyboardInput(key)"/>

            <div class="w-full h-[10%] sm:h-auto flex justify-center items-center space-x-4">
              <button type="button" class="text-xl text-white px-2 py-1 rounded-xl bg-red-500" v-on:keydown.enter.prevent="" v-on:click="(event) => resetGameState()">Reset</button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <div class="fixed flex justify-center top-[10%] sm:top-[25%] w-full z-20 pointer-events-none">
      <div class="max-w-[70%]">
        <MessageBubbles 
          id="bubbles" 
          v-bind:store-id="'bubbles-0'"
          v-bind:max-queue-size="5"
        />
      </div>
    </div>
  </div>
</template>
