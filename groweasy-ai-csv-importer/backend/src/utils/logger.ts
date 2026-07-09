type LogLevel = 'info' | 'warn' | 'error';

type LogContext = Record<string, string | number | boolean | undefined>;

const write = (level: LogLevel, event: string, context?: LogContext): void => {
  const timestamp = new Date().toISOString();
  const payload = context ? ` ${JSON.stringify(context)}` : '';
  const line = `[${timestamp}] [${level.toUpperCase()}] ${event}${payload}`;

  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.log(line);
};

/**
 * Lightweight structured logger.
 * Only accepts primitive context values so callers cannot accidentally
 * log sensitive record contents.
 */
export const logger = {
  info: (event: string, context?: LogContext): void => write('info', event, context),
  warn: (event: string, context?: LogContext): void => write('warn', event, context),
  error: (event: string, context?: LogContext): void => write('error', event, context),
};
