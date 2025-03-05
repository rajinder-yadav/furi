/**
 * Furi - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import path from "node:path";
import { Worker } from 'node:worker_threads';

import {
  LoggerMode,
  LogLevels,
  LogLevelsRank,
  mapToLogLevelRank
} from '../types.ts';

/**
 * Buffered logger class that uses a worker thread to handle logging.
 */
export class BufferedLogger {

  private readonly worker: Worker;
  private readonly logLevelRank: number;

  private closed = false;

  constructor(
    protected readonly logDirectory: string,
    protected readonly logFileName: string,
    protected enabled: boolean,
    protected terminal: boolean,
    protected flushPeriod: number,
    protected logMaxCount: number,
    protected logMode: LoggerMode,
    protected logLevel: string
  ) {
    this.logLevelRank = mapToLogLevelRank(logLevel);

    const dirName = (import.meta || globalThis.Deno) ? import.meta.dirname ?? '' : path.dirname(__filename);

    this.worker = new Worker(path.join(dirName, 'worker-logger.js'), {
      workerData: {
        logDirectory: this.logDirectory,
        logFileName: this.logFileName,
        enabled: this.enabled,
        flushPeriod: this.flushPeriod,
        logMaxCount: this.logMaxCount,
        logMode: this.logMode
      },
    });

    this.worker.on('error', (err) => {
      console.error('Logger worker error:', err);
    });

    this.worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Logger worker stopped with exit code ${code}`);
      }
    });
  }

  close() {
    if (!this.closed) {
      // Send a null message to the worker to signal it to stop processing and exit.
      this.closed = true;
      this.info('Buffered Logger closed.');
      this.info(null);
    }
  }

  debug(message: string | null) {
    if (this.enabled && this.logLevelRank <= LogLevelsRank.DEBUG) {
      this.worker.postMessage({ level: LogLevels.DEBUG, message, terminal: this.terminal });
    }
  }
  info(message: string | null) {
    if (this.enabled && this.logLevelRank <= LogLevelsRank.INFO) {
      this.worker.postMessage({ level: LogLevels.INFO, message, terminal: this.terminal });
    }
  }
  log(message: string | null) {
    if (this.enabled && this.logLevelRank <= LogLevelsRank.LOG) {
      this.worker.postMessage({ level: LogLevels.LOG, message, terminal: this.terminal });
    }
  }
  warm(message: string | null) {
    if (this.enabled && this.logLevelRank <= LogLevelsRank.WARN) {
      this.worker.postMessage({ level: LogLevels.WARN, message, terminal: this.terminal });
    }
  }
  error(message: string | null) {
    if (this.enabled && this.logLevelRank <= LogLevelsRank.ERROR) {
      this.worker.postMessage({ level: LogLevels.ERROR, message, terminal: this.terminal });
    }
  }
  critical(message: string | null) {
    if (this.enabled && this.logLevelRank <= LogLevelsRank.CRITICAL) {
      this.worker.postMessage({ level: LogLevels.CRITICAL, message, terminal: this.terminal });
    }
  }
  fatal(message: string | null) {
    if (this.enabled && this.logLevelRank <= LogLevelsRank.FATAL) {
      this.worker.postMessage({ level: LogLevels.FATAL, message, terminal: this.terminal });
    }
  }
}
