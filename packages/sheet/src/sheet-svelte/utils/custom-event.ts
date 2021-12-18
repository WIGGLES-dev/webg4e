export const fireCustomEvent = (type: string, init: CustomEventInit) => {
  return (e: Event) => {
    const event = new CustomEvent(type, init);
    e.target?.dispatchEvent(event);
  };
};
