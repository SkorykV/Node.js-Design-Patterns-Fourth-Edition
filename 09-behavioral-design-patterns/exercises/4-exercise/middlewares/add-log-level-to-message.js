export function addLogLevelToMessage(initialMessage) {
  const logLevel = initialMessage.level;
  const logLevelLabelPadded = `[${logLevel.toUpperCase()}]`.padEnd(7, " ");
  return {
    ...initialMessage,
    message: `${logLevelLabelPadded} ${initialMessage.message}`,
  };
}
