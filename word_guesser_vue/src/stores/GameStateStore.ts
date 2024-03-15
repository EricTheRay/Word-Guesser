import { ref, reactive } from 'vue'
import type { Ref } from 'vue';
import { defineStore } from 'pinia'

export const useGameStateStore = defineStore('gameState', () => {

  const date: Ref<string> = ref('');

  const isComplete: Ref<boolean> = ref(false);

  const isHardMode: Ref<boolean> = ref(false);
  const isDarkTheme: Ref<boolean> = ref(false);
  const isHighContrast: Ref<boolean> = ref(false);

  const rowIndex: Ref<number> = ref(0);
  const colIndex: Ref<number> = ref(0);

  const guessList: Array<Array<string>> = reactive(
    [ [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '] ]
  );

  const resultList: Array<Array<string>> = reactive(
    [ ['unchecked', 'unchecked', 'unchecked', 'unchecked', 'unchecked'], 
      ['unchecked', 'unchecked', 'unchecked', 'unchecked', 'unchecked'], 
      ['unchecked', 'unchecked', 'unchecked', 'unchecked', 'unchecked'], 
      ['unchecked', 'unchecked', 'unchecked', 'unchecked', 'unchecked'], 
      ['unchecked', 'unchecked', 'unchecked', 'unchecked', 'unchecked'], 
      ['unchecked', 'unchecked', 'unchecked', 'unchecked', 'unchecked'], 
      ['unchecked', 'unchecked', 'unchecked', 'unchecked', 'unchecked'],  ]
  );

  const isFlipped: Array<Array<boolean>> = reactive(
    [ [false, false, false, false, false], 
      [false, false, false, false, false], 
      [false, false, false, false, false], 
      [false, false, false, false, false], 
      [false, false, false, false, false], 
      [false, false, false, false, false] ]
  );

  const letterList: Record<string, string> = reactive({
    'A': 'available', 
    'B': 'available', 
    'C': 'available', 
    'D': 'available', 
    'E': 'available', 
    'F': 'available', 
    'G': 'available', 
    'H': 'available', 
    'I': 'available', 
    'J': 'available', 
    'K': 'available', 
    'L': 'available', 
    'M': 'available', 
    'N': 'available', 
    'O': 'available', 
    'P': 'available', 
    'Q': 'available', 
    'R': 'available', 
    'S': 'available', 
    'T': 'available', 
    'U': 'available', 
    'V': 'available', 
    'W': 'available', 
    'X': 'available', 
    'Y': 'available', 
    'Z': 'available'
  });

  const revealed: Set<string> = reactive(new Set());

  const currentAnswer: Array<string> = reactive([' ', ' ', ' ', ' ', ' ']);

  const ordinal = ['st', 'nd', 'rd', 'th', 'th'];

  const toggleHardMode = function(): string {
    if (isHardMode.value === false && rowIndex.value > 0) {
      return "Hard Mode can only be enabled in the beginning of a round";
    }

    isHardMode.value = !isHardMode.value;

    return "OK";
  };

  const toggleDarkTheme = function(): string {
    isDarkTheme.value = !isDarkTheme.value;

    return "OK";
  };

  const toggleHighContrast = function(): string {
    isHighContrast.value = !isHighContrast.value;

    return "OK";
  };

  const resetGameState = function(): void {

    date.value = new Date().toISOString().slice(0, 10);
    
    isComplete.value = false;

    isHardMode.value = false;
    isDarkTheme.value = false;
    isHighContrast.value = false;

    rowIndex.value = 0;
    colIndex.value = 0;

    for (let i = 0; i < 6; ++i) {
      for (let j = 0; j < 5; ++j) {
        guessList[i][j] = ' ';
        resultList[i][j] = 'unchecked';
        isFlipped[i][j] = false;
      }
    }

    for (const key of Object.keys(letterList)) {
      letterList[key] = 'available';
    }

    revealed.clear();

    for (let i = 0; i < 5; ++i) {
      currentAnswer[i] = ' ';
    }

    saveGameStateToStorage();

    return;
  };

  const initializeGameState = function(): void {

    const item = localStorage.getItem('gameState');

    if (item === null) {
      resetGameState();

      return;
    }
    
    const gameState = JSON.parse(item);

    const last_date = new Date(gameState.date);

    if (last_date.toString() === 'Invalid Date' || (new Date().getTime() - last_date.getTime()) / 86400000 >= 1) {
      resetGameState();

      return;
    }

    date.value = gameState.date;

    isHardMode.value = gameState.isHardMode;
    isDarkTheme.value = gameState.isDarkTheme;
    isHighContrast.value = gameState.isHighContrast;

    isComplete.value = gameState.isComplete;

    rowIndex.value = 6;

    let isEmpty = false;

    for (let i = 0; i < 6; ++i) {
      for (let j = 0; j < 5; ++j) {
        if (gameState.guessList[i][j] === ' ') {
          isEmpty = true;

          break;
        }

        guessList[i][j] = gameState.guessList[i][j];
        resultList[i][j] = gameState.resultList[i][j];
      }

      if (isEmpty === true) {
        rowIndex.value = i;

        for (; i < 6; ++i) {
          for (let j = 0; j < 5; ++j) {
            guessList[i][j] = ' ';
            resultList[i][j] = 'unchecked';
          }
        }

        break;
      }
    }

    return;
  };

  const inputLetter = function(letter: string): [number, number] {
    if (isComplete.value === true || colIndex.value === 5)
      return [-1, -1];

    const indices: [number, number] = [rowIndex.value, colIndex.value];

    guessList[rowIndex.value][colIndex.value++] = letter;

    return indices;
  };

  const eraseLetter = function(): void {
    if (isComplete.value === true || colIndex.value === 0)
      return;

    guessList[rowIndex.value][--colIndex.value] = ' ';

    return;
  };

  const validateGuess = function(): { status: string, description: string } {

    if (isComplete.value === true)
      return { status: "other", description: "Game already over" };

    if (colIndex.value !== 5)
      return { status: 'failure', description: "Not enough letters" };

    const word = guessList[rowIndex.value].reduce(
      (accu, curr) => {
        return accu + curr
      }, 
      ''
    );

    if (isHardMode.value === true) {
      for (let j = 0; j < 5; ++j) {
        if (currentAnswer[j] !== ' ' && word[j] !== currentAnswer[j]) {
          return {
            status: 'failure', 
            description: `The ${j + 1}${ordinal[j]} letter must be '${currentAnswer[j]}'`
          };
        }
      }

      for (const letter of revealed.values()) {
        if (word.includes(letter) === false) {
          return {
            status: 'failure', 
            description: `The guess must contain '${letter}'`
          };
        }
      }
    }

    return { status: 'success', description: word };
  };

  const updateResultList = function(checkResult: Array<string>): void {
    resultList[rowIndex.value] = checkResult;

    return;
  };

  const updateLetterList = function(word: string | Array<string>, checkResult: Array<string>): void {
    if (typeof word !== 'string') {
      word = word.reduce(
        (accu: string, curr: string) => {
          return accu + curr;
        },
        ''
      );
    }
    
    for (let j = 0; j < 5; ++j) {
      if (checkResult[j] === 'correct') {
        letterList[word[j]] = 'correct';
        revealed.add(word[j]);
        currentAnswer[j] = word[j];
      }
      else if (checkResult[j] === 'present') {
        if (letterList[word[j]] !== 'correct') {
          letterList[word[j]] = 'present';
          revealed.add(word[j]);
        }
      }
      else if (checkResult[j] === 'absent') {
        if (letterList[word[j]] !== 'correct' && letterList[word[j]] !== 'present')
          letterList[word[j]] = 'absent';
      }
    }

    return;
  };

  const flip = function(i: number, j: number): void {
    isFlipped[i][j] = true;

    return;
  };

  const toNextWordCard = function(): void {
    if (isComplete.value === true)
      return;
    
    ++rowIndex.value;
    colIndex.value = 0;

    if (rowIndex.value === 6)
      isComplete.value = true;

    return;
  };

  const setComplete = function(): void {
    isComplete.value = true;

    return;
  };

  const saveGameStateToStorage = function(): void {
    
    const tempGuessList = [ 
      [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '], 
      [' ', ' ', ' ', ' ', ' '] 
    ];

    for (let i = 0; i < rowIndex.value; ++i)
      for (let j = 0; j < 5; ++j)
        tempGuessList[i][j] = guessList[i][j];

    localStorage.setItem(
      'gameState', 
      JSON.stringify({
        date: date.value, 
        isHardMode: isHardMode.value, 
        isDarkTheme: isDarkTheme.value, 
        isHighContrast: isHighContrast.value, 
        isComplete: isComplete.value, 
        guessList: tempGuessList, 
        resultList: resultList
      })
    );

    return;
  };

  const deleteGameStateFromStorage = function(): void {
    localStorage.removeItemItem('gameState');

    return;
  };

  return {
    date, 
    isHardMode, 
    isDarkTheme, 
    isHighContrast, 
    isComplete, 
    rowIndex, 
    colIndex, 
    guessList, 
    resultList, 
    isFlipped, 
    letterList, 
    revealed, 
    toggleHardMode, 
    toggleDarkTheme, 
    toggleHighContrast, 
    resetGameState, 
    initializeGameState, 
    inputLetter, 
    eraseLetter, 
    validateGuess, 
    updateResultList, 
    updateLetterList, 
    flip, 
    toNextWordCard, 
    setComplete, 
    saveGameStateToStorage, 
    deleteGameStateFromStorage
  };
});
