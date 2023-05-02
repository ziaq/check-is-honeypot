import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, printf } = format;

const customFormat = (customLabel: string) => printf(({ timestamp, level, message }) => {
  const date = new Date(timestamp);
  const formattedTimestamp = date.toLocaleString('ru-RU', { hour12: false }) +
    ' :' + String(date.getMilliseconds()).padStart(3, '0');
  return `${formattedTimestamp} ${level} [${customLabel}]: ${message}`;
});

const fetchTransports = [
  new DailyRotateFile({
    filename: `logs/fetch-%DATE%.log`,
    datePattern: 'DD-MM-YYYY',
    maxSize: '10m',
    maxFiles: '10d',
    level: 'info',
  }),
];

const appTransports = [
  new DailyRotateFile({
    filename: `logs/app-%DATE%.log`,
    datePattern: 'DD-MM-YYYY',
    maxSize: '10m',
    maxFiles: '10d',
    level: 'info',
  }),
  new transports.Console({
    level: 'info',
  }),
];

const createCustomLabelLogger = (customLabel: string, loggerTransports: any[]) => createLogger({
  format: combine(timestamp(), customFormat(customLabel)),
  transports: loggerTransports,
});

const loggers = {
  info: createCustomLabelLogger('info', appTransports),
  error: createCustomLabelLogger('error', appTransports),
  fetch: createCustomLabelLogger('fetch', fetchTransports),
};

export default {
  info: loggers.info.info.bind(loggers.info),
  error: loggers.error.error.bind(loggers.error),
  fetch: loggers.fetch.info.bind(loggers.fetch),
};
