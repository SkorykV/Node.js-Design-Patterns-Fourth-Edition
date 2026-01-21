export function addTimestamp(initialMessage) {
  const timestamp = new Date().toISOString();
  return {
    ...initialMessage,
    message: `[${timestamp}] ${initialMessage.message}`,
  };
}
