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
import { Buffer } from 'node:buffer';

import { parentPort, workerData } from 'node:worker_threads';


/**
 * Worker thread message handler.
 */
if (parentPort) {
  parentPort.on('message', ({ level, message }: { level: string, message: string | null }) => {
    if (message) {
      LoggerWorker.log({ level, message });
    } else {
      LoggerWorker.log({ level, message: 'LoggerWorker closed.' });
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
  static logMaxCount: number = workerData.maxLogCount ?? 100;
  static flushPeriod: number = workerData.flushPeriod ?? 1000;
  static logMode: string = workerData?.logMode ?? 'buffered';

  /**
   * Following settings should not be changed.
   */
  static readonly logFilePath = path.join(workerData.logDirectory, workerData.logFileName);
  static readonly logStream = fs.createWriteStream(LoggerWorker.logFilePath, { flags: 'a' });

  static readonly bufferHighMark = LoggerWorker.logMaxCount * 100;
  static readonly bufferMaxSize = LoggerWorker.bufferHighMark * 1.25;

  static logBuffer: Buffer = Buffer.alloc(LoggerWorker.bufferMaxSize);
  static bufferOffset = 0;

  static timerId: number | null = null;

  static log({ level, message }: { level: string, message: string | null }) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}, ${level}, ${message}\n`;

    if (LoggerWorker.logMode === 'buffered') {
      LoggerWorker.bufferOffset += LoggerWorker.logBuffer.write(logEntry, LoggerWorker.bufferOffset, 'utf8');

      if (LoggerWorker.logBuffer.length >= LoggerWorker.bufferHighMark) {
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
