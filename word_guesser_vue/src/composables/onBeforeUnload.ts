export const onBeforeUnload = function(hook: () => any) {
    addEventListener('beforeunload', hook);
};
