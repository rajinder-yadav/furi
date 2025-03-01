/**
 * FURI - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import fs from 'node:fs';
import path from "node:path";

import { parentPort, workerData } from 'node:worker_threads';

/**
 * Worker thread message handler.
 */
if (parentPort) {
  parentPort.on('message', (message) => {
    if (message) {
      LoggerWorker.log(message);
    } else {
      LoggerWorker.log('LoggerWorker closed.');
      LoggerWorker.flush();
      LoggerWorker.stop();
    }
  });
}

/**
 * Static helper class for logging messages to a file.
 * The log messaged are buffered and then flush to file
 * are a set interval.
 */
class LoggerWorker {
  /**
   * Configurable settings.
   */
  static maxLogCount: number = 100;
  static flushPeriod: number = 1000;
  static logMode: string = 'buffered';

  /**
   * Following settings should not be changed.
   */
  static readonly logFilePath = path.join(workerData.logDirectory, workerData.logFileName);
  static readonly logStream = fs.createWriteStream(LoggerWorker.logFilePath, { flags: 'a' });

  static logBuffer: string[] = [];
  static timerId: number | null = null;

  static log(message: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${message}\n`;

    if (LoggerWorker.logMode === 'buffered') {
      LoggerWorker.logBuffer.push(logEntry);

      if (LoggerWorker.logBuffer.length >= LoggerWorker.maxLogCount) {
        LoggerWorker.flush();
      }

      if (LoggerWorker.timerId === null) {
        LoggerWorker.startTimer();
      }
    } else {
      LoggerWorker.logStream.write(logEntry);
    }
  }

  static startTimer() {
    LoggerWorker.timerId = setTimeout(() => {
      LoggerWorker.flush();
    }, LoggerWorker.flushPeriod);
  }
  static clearTimer() {
    if (LoggerWorker.timerId !== null) {
      clearTimeout(LoggerWorker.timerId);
      LoggerWorker.timerId = null;
    }
  }
  static resetBuffer() {
    LoggerWorker.logBuffer = [];
  }
  static flush() {
    const buf = LoggerWorker.logBuffer;
    LoggerWorker.clearTimer();
    LoggerWorker.resetBuffer();
    LoggerWorker.logStream.write(buf.join(''));
  }
  static stop() {
    LoggerWorker.flush();
    LoggerWorker.logStream.close();
  }
}
