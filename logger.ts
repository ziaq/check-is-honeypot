import winston from 'winston';
const { combine, timestamp, printf } = winston.format;

const customFormat = (customLabel: string) => printf(({ timestamp, level, message }) => {
  return `${timestamp} ${level} [${customLabel}]: ${message}`;
});

const createLoggerWithLabel = (customLabel: string) => {
  return winston.createLogger({
    format: combine(timestamp(), customFormat(customLabel)),
    transports: [
      new winston.transports.File({
        filename: './logs/app.log',
        level: 'info',
      }),
      new winston.transports.Console({
        level: 'info',
      }),
    ],
  });
};

const infoLogger = createLoggerWithLabel('info');
const errorLogger = createLoggerWithLabel('error');
const getPairLogger = createLoggerWithLabel('getPair');
const getSpecsLogger = createLoggerWithLabel('getSpecs');

const logger = {
  info: infoLogger.info.bind(infoLogger),
  error: errorLogger.error.bind(errorLogger),
  getPair: getPairLogger.info.bind(getPairLogger),
  getSpecs: getSpecsLogger.info.bind(getSpecsLogger),
};

export { logger };