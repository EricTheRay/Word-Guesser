import { nextTick } from 'vue';
import type { Ref } from 'vue';

export const forceReflow = function(): void {
  document.body.offsetHeight;
}

export class Animator {
  startAnimation: () => Promise<number>;
  stopAnimation: () => void;

  constructor(target: HTMLElement, duration: number, isCancellable: boolean, startFunction: () => any, stopFunction?: () => any) {
    this.startAnimation = function() {

      return new Promise((resolve, reject) => {
        startFunction();
        
        const timeoutID = setTimeout(
          () => {
            if (stopFunction !== undefined)
              stopFunction();

            resolve(0);
          },
          duration
        );
        
        if (isCancellable === true) {
          this.stopAnimation = function() {
            clearTimeout(timeoutID);

            if (stopFunction !== undefined)
              stopFunction();

            void(target.offsetHeight);

            resolve(0);
          }
        }
      });
    };

    this.stopAnimation = function() {};
  }
};

export class ClassAnimator extends Animator {
  constructor(target: HTMLElement, duration: number, isCancellable: boolean, animClass: string, animStyles?: Object) {
    const classList = target.classList;
    const styleList = target.style;
    
    const startFunction = function() {
      classList.add(animClass);
    
      if (animStyles !== undefined) {
        for (const [key, value] of Object.entries(animStyles)) {
          styleList.setProperty(key, value);
        }
      }
    };

    const stopFunction = function() {
      classList.remove(animClass);
    
      if (animStyles !== undefined) {
        for (const [key, value] of Object.entries(animStyles)) {
          styleList.removeProperty(key);
        }
      }
    };

    super(target, duration, isCancellable, startFunction, stopFunction);
  }
};

export class FunctionAnimator extends Animator {
  constructor(target: HTMLElement, duration: number, isCancellable: boolean, startFunction: () => any, stopFunction?: () => any) {
    const classList = target.classList;
    const styleList = target.style;

    super(target, duration, isCancellable, startFunction, stopFunction);
  }
}

export class AnimationHandler {
  animQueue: Array<Animator>;
  blockHandle: Ref<boolean> | null;

  constructor(blockHandle?: Ref<boolean>) {
    this.blockHandle = blockHandle ?? null;
    this.animQueue = [];
  }

  async push(animation: Animator) {
    if (this.animQueue.length > 0) {
      this.animQueue[0].stopAnimation();

      await nextTick();
    }

    this.animQueue.push(animation);

    if (this.animQueue.length === 1)
      this.triggerNext();
  }

  triggerNext() {
    if (this.blockHandle !== null)
      this.blockHandle.value = true;

    this.animQueue[0].startAnimation()
      .then((value) => {
        if (this.blockHandle !== null)
          this.blockHandle.value = false;

        this.animQueue.shift();

        this.triggerNext();
      });
  }
};

export const addAnimClass = function(target: HTMLElement, animClass: string, animStyles?: object): void {
  const classList = target.classList;
  const styleList = target.style;

  classList.add(animClass);

  if (animStyles !== undefined) {
    for (const [key, value] of Object.entries(animStyles)) {
      styleList.setProperty(key, value);
    }
  }
};

export const removeAnimClass = function(target: HTMLElement, animClass: string, animStyles?: object): void {
  const classList = target.classList;
  const styleList = target.style;

  classList.remove(animClass);

  if (animStyles !== undefined) {
    for (const [key, value] of Object.entries(animStyles)) {
      styleList.removeProperty(key);
    }
  }
};

export const animateClass = function(target: HTMLElement, duration: number, animClass: string, animStyles?: object): Promise<void> {
  return new Promise((resolve, reject) => {
    if (target.classList.contains(animClass))
    {
      console.log("blocked");
      resolve();
    }
    else {
      addAnimClass(target, animClass, animStyles);
      
      setTimeout(
        () => {
          removeAnimClass(target, animClass, animStyles);

          resolve();
        },
        duration
      );
    }
  });
};

export class ClassAndStyleList {
  classList: Array<string>;
  styleList: Record<string, string>;

  constructor(classList?: Array<string>, styleList?: Record<string, string>) {
    this.classList = classList || [];
    this.styleList = styleList || {};
  }
};


