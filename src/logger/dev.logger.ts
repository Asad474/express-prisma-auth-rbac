import { createLogger, format, Logger, transports } from 'winston';

const { combine, timestamp, colorize, printf } = format;

/**
 * Returns a logger instance that logs messages to the console.
 * The logger is configured to log messages at the debug level and above.
 * The log format is: `${timestamp} ${level}: ${stack ?? message}`
 * Where:
 * - `timestamp` is the timestamp of the log message in the format `YYYY-MM-DD HH:mm:ss`
 * - `level` is the log level (e.g. debug, info, warn, error)
 * - `stack` is the stack trace of the log message, if available
 * - `message` is the log message itself
 */
const devLogger = (): Logger => {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack ?? message}`;
  });

  return createLogger({
    level: 'debug',
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat,
    ),
    transports: [new transports.Console()],
  });
};

export default devLogger;
