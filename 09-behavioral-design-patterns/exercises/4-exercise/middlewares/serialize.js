export function serialize(initialMessage) {
  if (!initialMessage || typeof initialMessage.message === "string") {
    return initialMessage;
  }
  if (initialMessage.message instanceof Error) {
    return {
      ...initialMessage,
      message: initialMessage.message,
    };
  }
  return {
    ...initialMessage,
    message: JSON.stringify(initialMessage.message),
  };
}
