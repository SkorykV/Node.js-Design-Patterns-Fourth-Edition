const COLORS_MAP = {
  info: "\x1b[32m", // Green
  debug: "\x1b[34m", // Blue
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
};

const RESET = "\x1b[0m";

export function applyColor(initialMessage) {
  const color = COLORS_MAP[initialMessage.level] ?? RESET;
  const message = {
    ...initialMessage,
    message: `${color}${initialMessage.message}${RESET}`,
  };
  return message;
}
