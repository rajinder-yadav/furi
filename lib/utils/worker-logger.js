/**
 * Furi - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import fs from 'node:fs';
import path from "node:path";
import { Buffer } from 'node:buffer';

import { parentPort, workerData } from 'node:worker_threads';

/**
 * Worker thread message handler.
 */
if (parentPort) {
  parentPort.on('message', ({ level, message, terminal }) => {
    if (message) {
      LoggerWorker.log({ level, message, terminal });
    } else {
      LoggerWorker.log({ level, message: 'Logger Worker thread stopped.', terminal });
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
  static logMaxCount = workerData.maxLogCount ?? 100;
  static flushPeriod = workerData.flushPeriod ?? 1000;
  static logMode = workerData?.logMode ?? 'buffer';

  /**
   * Following settings should not be changed.
   */
  static logFilePath = path.join(workerData.logDirectory, workerData.logFileName);
  static logStream = fs.createWriteStream(LoggerWorker.logFilePath, { flags: 'a' });

  static bufferHighMark = LoggerWorker.logMaxCount * 100;
  static bufferMaxSize = LoggerWorker.bufferHighMark * 1.25;

  static logBuffer = Buffer.alloc(LoggerWorker.bufferMaxSize);
  static bufferOffset = 0;

  static timerId = null;

  static log({ level, message, terminal }) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}, ${level}, ${message}`;

    if (LoggerWorker.logMode === 'buffer') {
      LoggerWorker.bufferOffset += LoggerWorker.logBuffer.write(`${logEntry}\n`, LoggerWorker.bufferOffset, 'utf8');

      if (LoggerWorker.logBuffer.length >= LoggerWorker.bufferHighMark) {
        LoggerWorker.flush();
      }

      if (LoggerWorker.timerId === null) {
        LoggerWorker.startTimer();
      }
    } else {
      LoggerWorker.logStream.write(`${logEntry}\n`);
    }
    if(terminal) {
      console.log(logEntry)
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
    LoggerWorker.logBuffer.fill(0);
    // LoggerWorker.logBuffer = Buffer.alloc(100*LoggerWorker.logMaxCount*1.5);
    LoggerWorker.bufferOffset = 0;
  }
  static flush() {
    // Only write the final valid data in the buffer.
    LoggerWorker.logStream.write(LoggerWorker.logBuffer.toString().slice(0, LoggerWorker.bufferOffset));
    LoggerWorker.clearTimer();
    LoggerWorker.resetBuffer();
  }
  static stop() {
    LoggerWorker.flush();
    LoggerWorker.logStream.close();
  }
}
