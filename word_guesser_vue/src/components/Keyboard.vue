<script setup lang="ts">
import Key from '@/components/Key.vue';

const props = defineProps<{
  letterList: Record<string, string>
}>();

const emit = defineEmits<{
  (e: 'key-input', key: string): void
}>();

const handleKeyClick = function(key: string): void {
  emit('key-input', key);
};
</script>

<template>
  <div class="p-2 flex flex-col space-y-2">
    <div class="flex justify-center space-x-2">
      <Key class="w-10 h-12" v-bind:value="'Q'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['Q']" v-on:key-click="(value) => handleKeyClick('q')"><template v-slot:key>Q</template></Key>
      <Key class="w-10 h-12" v-bind:value="'W'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['W']" v-on:key-click="(value) => handleKeyClick('w')"><template v-slot:key>W</template></Key>
      <Key class="w-10 h-12" v-bind:value="'E'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['E']" v-on:key-click="(value) => handleKeyClick('e')"><template v-slot:key>E</template></Key>
      <Key class="w-10 h-12" v-bind:value="'R'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['R']" v-on:key-click="(value) => handleKeyClick('r')"><template v-slot:key>R</template></Key>
      <Key class="w-10 h-12" v-bind:value="'T'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['T']" v-on:key-click="(value) => handleKeyClick('t')"><template v-slot:key>T</template></Key>
      <Key class="w-10 h-12" v-bind:value="'Y'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['Y']" v-on:key-click="(value) => handleKeyClick('y')"><template v-slot:key>Y</template></Key>
      <Key class="w-10 h-12" v-bind:value="'U'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['U']" v-on:key-click="(value) => handleKeyClick('u')"><template v-slot:key>U</template></Key>
      <Key class="w-10 h-12" v-bind:value="'I'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['I']" v-on:key-click="(value) => handleKeyClick('i')"><template v-slot:key>I</template></Key>
      <Key class="w-10 h-12" v-bind:value="'O'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['O']" v-on:key-click="(value) => handleKeyClick('o')"><template v-slot:key>O</template></Key>
      <Key class="w-10 h-12" v-bind:value="'P'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['P']" v-on:key-click="(value) => handleKeyClick('p')"><template v-slot:key>P</template></Key>

    </div>
    <div class="flex justify-center space-x-2">
      <Key class="w-10 h-12" v-bind:value="'A'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['A']" v-on:key-click="(value) => handleKeyClick('a')"><template v-slot:key>A</template></Key>
      <Key class="w-10 h-12" v-bind:value="'S'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['S']" v-on:key-click="(value) => handleKeyClick('s')"><template v-slot:key>S</template></Key>
      <Key class="w-10 h-12" v-bind:value="'D'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['D']" v-on:key-click="(value) => handleKeyClick('d')"><template v-slot:key>D</template></Key>
      <Key class="w-10 h-12" v-bind:value="'F'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['F']" v-on:key-click="(value) => handleKeyClick('f')"><template v-slot:key>F</template></Key>
      <Key class="w-10 h-12" v-bind:value="'G'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['G']" v-on:key-click="(value) => handleKeyClick('g')"><template v-slot:key>G</template></Key>
      <Key class="w-10 h-12" v-bind:value="'J'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['J']" v-on:key-click="(value) => handleKeyClick('j')"><template v-slot:key>J</template></Key>
      <Key class="w-10 h-12" v-bind:value="'H'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['H']" v-on:key-click="(value) => handleKeyClick('h')"><template v-slot:key>H</template></Key>
      <Key class="w-10 h-12" v-bind:value="'K'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['K']" v-on:key-click="(value) => handleKeyClick('k')"><template v-slot:key>K</template></Key>
      <Key class="w-10 h-12" v-bind:value="'L'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['L']" v-on:key-click="(value) => handleKeyClick('l')"><template v-slot:key>L</template></Key>
    </div>
    <div class="flex justify-center space-x-2">
      <Key class="w-16 h-12" v-bind:value="'Enter'" v-bind:classList="['text-base', 'font-bold']" v-on:key-click="(value) => handleKeyClick('Enter')">
        <template v-slot:key>
          Enter
        </template>
      </Key>
      <Key class="w-10 h-12" v-bind:value="'Z'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['Z']" v-on:key-click="(value) => handleKeyClick('z')"><template v-slot:key>Z</template></Key>
      <Key class="w-10 h-12" v-bind:value="'X'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['X']" v-on:key-click="(value) => handleKeyClick('x')"><template v-slot:key>X</template></Key>
      <Key class="w-10 h-12" v-bind:value="'C'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['C']" v-on:key-click="(value) => handleKeyClick('c')"><template v-slot:key>C</template></Key>
      <Key class="w-10 h-12" v-bind:value="'V'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['V']" v-on:key-click="(value) => handleKeyClick('v')"><template v-slot:key>V</template></Key>
      <Key class="w-10 h-12" v-bind:value="'B'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['B']" v-on:key-click="(value) => handleKeyClick('b')"><template v-slot:key>B</template></Key>
      <Key class="w-10 h-12" v-bind:value="'N'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['N']" v-on:key-click="(value) => handleKeyClick('n')"><template v-slot:key>N</template></Key>
      <Key class="w-10 h-12" v-bind:value="'M'" v-bind:classList="['text-xl', 'font-bold']" v-bind:status="props.letterList['M']" v-on:key-click="(value) => handleKeyClick('m')"><template v-slot:key>M</template></Key>
      <Key class="w-16 h-12" v-bind:value="'Backspace'" v-bind:classList="['text-base', 'font-bold']" v-on:key-click="(value) => handleKeyClick('Backspace')">
        <template v-slot:key>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 -960 960 960"><path class="fill-positive" d="M360-200q-20 0-37.5-9T294-234L120-480l174-246q11-16 28.5-25t37.5-9h400q33 0 56.5 23.5T840-680v400q0 33-23.5 56.5T760-200H360Zm400-80v-400 400Zm-400 0h400v-400H360L218-480l142 200Zm96-40 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Z"/></svg>
        </template>
      </Key>
    </div>
  </div>
</template>
