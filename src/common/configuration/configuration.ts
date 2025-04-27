export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    name: process.env.APP_NAME || 'skill-share-backend',
  },
  log: {
    level: process.env.APP_LOG_LEVEL || 'info',
    directoryMount: process.env.LOGS_DIRECTORY_MOUNT || 'logs',
    subDirectory: process.env.LOGS_SUB_DIRECTORY || '',
    filePrefix: process.env.LOGS_FILE_PREFIX || 'combined',
    errorFilePrefix: process.env.LOGS_ERROR_FILE_PREFIX || 'error',
    dateParttern: process.env.LOGS_DATEPATTERN || 'MM-DD-YYYY',
    maxSize: process.env.LOGS_FILE_MAXSIZE || '100m',
    maxFile: process.env.LOGS_FILE_MAXFILE || '30d',
    zippedArchive: (process.env.LOGS_ZIPPED_ARCHIVE === 'true') || true,
    datePattern: (process.env.LOGS_DATE_PATTERN) || 'YYYY-MM-DD',
  },
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || '5432',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    databaseName: process.env.DB_NAME || '',
    synchronize: process.env.DB_SYNCHRONIZE === 'true'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  }
});
