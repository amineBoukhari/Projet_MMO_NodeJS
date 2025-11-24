import winston from 'winston';
import config from './config.js';
// Define log levels
const levels = {
    error: 0, // Critical logs
    warn: 1,  // Warnings
    info: 2,  // General information
    http: 3,  // HTTP request logs
    debug: 4  // Detailed logs (used in development)
};

// Add colors to improve readability in the console
winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
});

// Define log level based on environment
const logLevel = config.NODE_ENV === 'development' ? 'debug' : 'warn';

// Create a Winston instance
const logger = winston.createLogger({
    level: logLevel,
    levels,
    format: winston.format.combine(
        // Add a timestamp for each log
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        // Define a custom log format
        winston.format.printf(
            (info) => `${info.timestamp} [${info.level}]: ${info.message}`
        )
    ),
    transports: [
        // File for critical errors
        new winston.transports.File({
            level: 'error',
            filename: 'logs/error.log',
            maxsize: 10000000, // 10 MB
            maxFiles: 10       // Keep the last 10 files
        }),
        // File for all combined logs
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 10000000, // 10 MB
            maxFiles: 10       // Keep the last 10 files
        })
    ]
});

// Add a Console transport if in development
if (config.NODE_ENV === 'development') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }), // Colors for logs
                winston.format.printf(
                    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
                )
            )
        })
    );
}

export default logger;
