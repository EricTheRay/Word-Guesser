<script setup lang="ts">
import { useMessageBubbles } from '@/composables/MessageBubblesStore';
import MessageBubble from '@/components/MessageBubble.vue';

/* Props */

const props = defineProps<
  {
    storeId: string, 
    maxQueueSize: number
  }
>();

/* Data and Initialization */

const messageBubbles = useMessageBubbles(props.storeId);

// class Bubble {
//   app: App<Element>;
//   element: HTMLElement;
//   ref: any;
//   isHiding: boolean;

//   constructor(app: App<Element>, element: HTMLElement, ref: any) {
//     this.app = app;
//     this.element = element;
//     this.ref = ref;
//     this.isHiding = false;
//   }
// };

// const containerElement: Ref<HTMLElement | null> = ref(null);

// const active_count: Ref<number> = ref(0);

// const bubbles: Array<Bubble> = reactive(
//   []
// );

// onMounted(() => {
//   containerElement.value = document.getElementById('bubble-container');
// });

// /* Utilities */

// const findBubble = function(bubbles: Array<Bubble>, element: HTMLElement): number {
//   for (let i = 0; i < bubbles.length; ++i) {  
//     if (bubbles[i].element === element)
//       return i;
//   }

//   return bubbles.length;
// }

// const findFirstActive = function(bubbles: Array<Bubble>): number {
//   for (let i = 0; i < bubbles.length; ++i) {  
//     if (bubbles[i].isHiding === false)
//       return i;
//   }

//   return bubbles.length;
// }

// const popBubble = function(bubbles: Array<Bubble>, bubble: Bubble): void {
//   const idx = findBubble(bubbles, bubble.element);

//   bubbles.splice(idx, 1);
// };

// /* Event Handlers */

// const showBubble = function(bubble: Bubble): void {
//   ++active_count.value;
//   bubble.isHiding = false;

//   fadeInOut(bubble.element, 500, 2000, 500);

//   setTimeout(
//     () => {
//       hideBubble(bubble);
//     }, 
//     2995
//   );
// };

// const hideBubble = function(bubble: Bubble): void {
//   if (bubble.isHiding === true)
//     return;

//   bubble.isHiding = true;
//   --active_count.value;
  
//   bubble.element.style.setProperty('opacity', '0%');
//   shrinkY(bubble.element, 1000);

//   setTimeout(
//     () => {
//       destroyBubble(bubble);
//     }, 
//     1000
//   );
// };

// const destroyBubble = function(bubble: Bubble): void {
//   popBubble(bubbles, bubble);

//   bubble.app.unmount();
//   bubble.element.remove();
// };

// const push = function(message: string): void {
//   const bubbleApp = createApp(MessageBubble, { message: message });
//   const bubbleElement = document.createElement('div');

//   const bubbleRef: any = bubbleApp.mount(bubbleElement);

//   if (bubbles.length === 0) {
//     containerElement.value!.appendChild(bubbleElement);

//   } else if (active_count.value < props.maxQueueSize) {
//     containerElement.value!.insertBefore(bubbleElement, containerElement.value!.firstChild);

//   } else {
//     hideBubble(bubbles[findFirstActive(bubbles)]);
//     containerElement.value!.insertBefore(bubbleElement, containerElement.value!.firstChild);
//   }

//   const bubble = new Bubble(bubbleApp, bubbleElement, bubbleRef);

//   bubbles.push(bubble);

//   showBubble(bubble);
// };

// /* Animations */

// const fadeInOut = function(target: HTMLElement, timeIn: number, timePersist: number, timeOut: number): void {
//   animateClass(
//     target, 
//     timeIn, 
//     'animate-fade-in', 
//     {
//       '--fade-in-duration': String(timeIn) + 'ms'
//     }
//   );

//   setTimeout(
//     () => {
//       animateClass(
//         target, 
//         timeOut, 
//         'animate-fade-out', 
//         {
//           '--fade-out-duration': String(timeOut) + 'ms'
//         }
//       );
//     }, 
//     timeIn + timePersist
//   );
// };

// const shrinkY = function(target: HTMLElement, duration: number): void {
//   animateClass(
//     target, 
//     duration, 
//     'animate-shrink-y', 
//     {
//       '--shrink-duration': String(duration) + 'ms'
//     }
//   );
// };

// /* Expose */

// defineExpose({
//   push
// });
</script>

<template>
  <div class="flex flex-col space-y-2">
    <TransitionGroup 
      appear 
      enter-from-class="opacity-0" 
      enter-to-class="opacity-100" 
      enter-active-class="transition-all duration-[0.5s] ease-linear" 
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      leave-active-class="transition-all duration-[0.5s] ease-linear"
    >
      <MessageBubble 
       v-for="i in Math.min(messageBubbles.messageList.length, props.maxQueueSize)" 
       v-bind:key="messageBubbles.messageList[i - 1].id" 
       v-bind:message="messageBubbles.messageList[i - 1].content" 
      />
    </TransitionGroup>
  </div>
</template>
