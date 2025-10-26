import { createLogger, format, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, json } = format;

/**
 * Returns a logger instance that logs messages to the console and to daily rotated files.
 * The logger is configured to log messages at the info level and above.
 * The log format is: `${timestamp} ${level}: ${message}`
 * Where:
 * - `timestamp` is the timestamp of the log message in the format `YYYY-MM-DD HH:mm:ss`
 * - `level` is the log level (e.g. info, warn, error)
 * - `message` is the log message itself
 * The logger is also configured to rotate log files daily, with a maximum file size of 20MB and a maximum of 14 days of log files.
 */
const prodLogger = (): Logger => {
  return createLogger({
    level: 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
    transports: [
      new transports.Console(),
      new transports.DailyRotateFile({
        filename: 'info-%DATE%.log',
        dirname: 'logs',
        // eslint-disable-next-line sonarjs/no-duplicate-string
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'info',
      }),
      new transports.DailyRotateFile({
        filename: 'error-%DATE%.log',
        dirname: 'logs',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
      }),
    ],
    exceptionHandlers: [
      new transports.DailyRotateFile({
        filename: 'exceptions-%DATE%.log',
        dirname: 'logs',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
    rejectionHandlers: [
      new transports.DailyRotateFile({
        filename: 'rejections-%DATE%.log',
        dirname: 'logs',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });
};

export default prodLogger;
