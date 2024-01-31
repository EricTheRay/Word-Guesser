import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  content: string;
};

export const useMessageBubbles = function(id: string) {
  return defineStore(
    id, 
    () => {
      const messageList: Array<Message> = reactive(
        []
      );

      const push = function(content: string, duration?: number): void {
        const message = {
          id: uuidv4(), 
          content: content
        };

        messageList.unshift(message);

        if (duration !== undefined) {
          setTimeout(
            () => {
              pop(message.id);
            }, 
            duration
          );
        }
      };

      const pop = function(id: string): void {
        let idx: number;
        for (idx = 0; idx < messageList.length; ++idx) {
          if (messageList[idx].id === id)
            break;
        }

        if (idx !== messageList.length) {
          messageList.splice(idx, 1);
        }
      };

      return {
        messageList, 
        push, 
        pop
      };
    }
  )();
};
