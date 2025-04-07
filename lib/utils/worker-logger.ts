/**
 * Furi - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016 - 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import fs from 'node:fs';
import zlib from 'node:zlib';
import { pipeline } from 'node:stream';

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
      WorkerLogger.log({ level, message: 'WorkerLogger Worker thread stopped.' });
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
  static enable = workerData?.enable ?? false;
  static terminal = workerData.terminal ?? false;

  static logStream: fs.WriteStream | null  = workerData?.enable ? fs.createWriteStream(workerData.filename, { flags: 'a' }) : null;

  static bufferHighMark = WorkerLogger.logMaxCount * 100;
  static bufferMaxSize = WorkerLogger.bufferHighMark * 1.25;

  static logBuffer = Buffer.alloc(WorkerLogger.bufferMaxSize);
  static bufferOffset = 0;

  static timerId: NodeJS.Timeout | number | null = null;
  static timerIdLogRollover: NodeJS.Timeout | number | null = null;

  // Start log rollover timer.
  static {
    WorkerLogger.timerIdLogRollover = setInterval(() => {
      console.log(`Rolling over log`);
      WorkerLogger.rollover();
    }, workerData.rollover);
  }

  static log({ level, message }: { level: string, message: string }) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}, ${level}, ${message}`;

    if (WorkerLogger.enable && WorkerLogger.logMode === 'buffer') {
      WorkerLogger.bufferOffset += WorkerLogger.logBuffer.write(`${logEntry}\n`, WorkerLogger.bufferOffset, 'utf8');

      if (WorkerLogger.logBuffer.length >= WorkerLogger.bufferHighMark) {
        WorkerLogger.flush();
      }

      if (WorkerLogger.timerId === null) {
        WorkerLogger.startTimer();
      }
    } else if (WorkerLogger.enable && WorkerLogger.logStream) {
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
      clearTimeout(WorkerLogger.timerId as number);
      WorkerLogger.timerId = null;
    }
  }
  static resetBuffer() {
    WorkerLogger.logBuffer.fill(0);
    WorkerLogger.bufferOffset = 0;
  }
  static flush() {
    // Only write the final valid data in the buffer.
    if (WorkerLogger.enable && WorkerLogger.logStream) {
      WorkerLogger.logStream.write(WorkerLogger.logBuffer.toString().slice(0, WorkerLogger.bufferOffset));
      WorkerLogger.clearTimer();
      WorkerLogger.resetBuffer();
    }
  }
  static stop() {
    if (WorkerLogger.timerIdLogRollover) {
      console.log('Stopping timer');
      clearInterval(WorkerLogger.timerIdLogRollover as number);
      WorkerLogger.timerIdLogRollover = null;
    }
    if (WorkerLogger.enable && WorkerLogger.logStream) {
      WorkerLogger.flush();
      WorkerLogger.logStream.close();
    }
  }
  static rollover() {
    // Implement log file rollover logic here.
    // For example, you can rename the current log file and create a new one.
    if (WorkerLogger.enable && WorkerLogger.logStream) {
      try {
        if (fs.existsSync(workerData.filename)) {
          const date = new Date();
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
          const dd = String(date.getDate()).padStart(2, '0');
          const h = String(date.getHours()).padStart(2, '0');
          const m = String(date.getMinutes()).padStart(2, '0');
          const s = String(date.getSeconds()).padStart(2, '0');

          const rolledFilename = `${workerData.filename}.${yyyy}-${mm}-${dd}+${h}${m}${s}.log`;
          WorkerLogger.logStream.close();
          fs.renameSync(workerData.filename, rolledFilename);

          WorkerLogger.logStream = fs.createWriteStream(workerData.filename, { flags: 'a' });
          WorkerLogger.logStream.write('--Furi log rollover continuation--\n');

          // Peroform log rollover.
          const src = fs.createReadStream(rolledFilename);
          const dest = fs.createWriteStream(`${rolledFilename}.gz`);
          const gzip = zlib.createGzip();

          pipeline(src, gzip, dest, (err) => {
            if (err) {
              console.error('WorkerLogger::rollover An error occurred.', err);
            } else {
              src.close();
              dest.close();
              gzip.close();
              fs.unlink(rolledFilename, () => {/* NOP */ });
            }
          });
        }
      } catch (error) {
        // CONTINUE
      }
    }
  }
}
