import * as colors from 'colors/safe';
import { createLogger, format, transports } from 'winston';
import { ConfigService } from '@nestjs/config';
import 'winston-daily-rotate-file';

colors.setTheme({
  error: 'red',
  warn: 'magenta',
  info: 'green',
  debug: 'blue',
  silly: 'grey',
});

const splat = (Symbol.for('splat') as unknown) as string;
const lvl = (Symbol.for('level') as unknown) as string;

// Colorize formatter
const colorize = format((info: any) => {
  info.label = colors.yellow(`[${info.label}]`);
  info.ms = colors.yellow(info.ms);

  if (colors[info[lvl]]) {
    info.level = colors[info[lvl]](`[${info.level}]`);
    info.message = colors[info[lvl]](info.message);
  } else {
    info.level = colors.green(`[${info.level}]`);
    info.message = colors.green(info.message);
  }

  return info;
});

// Correct final printf format
const logFormat = format.printf(({ timestamp, label, level, message, ms, ...meta }) => {
  const requestId = meta?.[splat]?.[0] ?? '';
  const formattedTimestamp = new Date(timestamp as string).toLocaleString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  return `${formattedTimestamp} ${label} ${level} ${requestId} ${message} ${ms}`;
});

export function createLoggerFactory(label: string, configService: ConfigService) {
  const config = configService.get('log', { infer: true });
  const appName = configService.get('app.name', { infer: true });

  const logger = createLogger({
    level: config.level,
    format: format.combine(
      format.label({ label }),
      format.timestamp(),
      format.ms(),
      logFormat
    ),
    defaultMeta: { service: appName },
    transports: [
      new transports.DailyRotateFile({
        filename: `${config.directoryMount}/${config.subDirectory}/${config.errorFilePrefix}-%DATE%.log`.replace(/([^:])(\/\/+)/g, '$1/'),
        datePattern: config.datePattern,
        zippedArchive: config.zippedArchive,
        maxSize: config.maxSize,
        maxFiles: config.maxFile,
        level: 'error',
      }),
      new transports.DailyRotateFile({
        filename: `${config.directoryMount}/${config.subDirectory}/${config.filePrefix}-%DATE%.log`.replace(/([^:])(\/\/+)/g, '$1/'),
        datePattern: config.datePattern,
        zippedArchive: config.zippedArchive,
        maxSize: config.maxSize,
        maxFiles: config.maxFile,
        level: config.level,
      }),
      new transports.Console({
        level: 'silly',
        format: format.combine(colorize(), format.timestamp(), format.ms(), logFormat),
      }),
    ],
  });

  logger.info(`Logger configured: [Level ${config.level}] [Dir: ${config.directoryMount}/${config.subDirectory}]`);

  return logger;
}
