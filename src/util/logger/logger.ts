import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Create a Winston logger instance
const logger = winston.createLogger({
  level: "info", // Set the logging level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, label, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
    winston.format.json()
  ), // Specify the log format (in this example, JSON)
  transports: [
    new winston.transports.Console(), // Output logs to the console
    // new winston.transports.File({ filename: "logs/application.log" }), // Output logs to a file
    new DailyRotateFile({
      dirname: "./logs",
      filename: "server_%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "info",
      zippedArchive: true,
      maxSize: "100m",
    }),
    new DailyRotateFile({
      dirname: "./logs",
      filename: "server_error_%DATE%.log",
      datePattern: "YYYY-MM",
      level: "error",
      zippedArchive: true,
      maxSize: "5m",
    }),
  ],
});

export default logger;
