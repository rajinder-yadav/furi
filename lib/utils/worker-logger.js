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
import { Buffer } from 'node:buffer';
import { parentPort, workerData } from 'node:worker_threads';

/**
 * Worker thread message handler.
 */
if (parentPort) {
  parentPort.on('message', ({ level, message }) => {
    if (message) {
      WorkerLogger.log({ level, message });
    } else {
      WorkerLogger.log({ level, message: 'Logger Worker thread stopped.' });
      WorkerLogger.flush();
      WorkerLogger.stop();
    }
  });
}

/**
 * Static helper class for logging messages to a file and terminal.
 * Log messages can be buffered and flushed to file as periodic intervals or when
 * the buffer reached the high water mark.
 */
class WorkerLogger {
  /**
   * Settings should not be changed after initialization.
   */
  static logMaxCount = workerData.maxLogCount ?? 100;
  static flushPeriod = workerData.flushPeriod ?? 1000;
  static logMode = workerData?.logMode ?? 'buffer';
  static enabled = workerData?.enabled ?? false;
  static terminal = workerData.terminal ?? false;
  static logStream = workerData?.enabled ?fs.createWriteStream(workerData.filename, { flags: 'a' }) : null;

  static bufferHighMark = WorkerLogger.logMaxCount * 100;
  static bufferMaxSize = WorkerLogger.bufferHighMark * 1.25;

  static logBuffer = Buffer.alloc(WorkerLogger.bufferMaxSize);
  static bufferOffset = 0;

  static timerId = null;

  static log({ level, message  }) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}, ${level}, ${message}`;

    if (WorkerLogger.enabled && WorkerLogger.logMode === 'buffer') {
      WorkerLogger.bufferOffset += WorkerLogger.logBuffer.write(`${logEntry}\n`, WorkerLogger.bufferOffset, 'utf8');

      if (WorkerLogger.logBuffer.length >= WorkerLogger.bufferHighMark) {
        WorkerLogger.flush();
      }

      if (WorkerLogger.timerId === null) {
        WorkerLogger.startTimer();
      }
    } else if (WorkerLogger.enabled) {
      WorkerLogger.logStream.write(`${logEntry}\n`);
    }
    if (WorkerLogger.terminal) {
      console.log(logEntry)
    }
  }

  static startTimer() {
    WorkerLogger.timerId = setTimeout(() => {
      WorkerLogger.flush();
    }, WorkerLogger.flushPeriod);
  }
  static clearTimer() {
    if (WorkerLogger.timerId !== null) {
      clearTimeout(WorkerLogger.timerId);
      WorkerLogger.timerId = null;
    }
  }
  static resetBuffer() {
    WorkerLogger.logBuffer.fill(0);
    WorkerLogger.bufferOffset = 0;
  }
  static flush() {
    // Only write the final valid data in the buffer.
    if (WorkerLogger.enabled) {
      WorkerLogger.logStream.write(WorkerLogger.logBuffer.toString().slice(0, WorkerLogger.bufferOffset));
      WorkerLogger.clearTimer();
      WorkerLogger.resetBuffer();
    }
  }
  static stop() {
    if (WorkerLogger.enable) {
      WorkerLogger.flush();
      WorkerLogger.logStream.close();
    }
  }
}
