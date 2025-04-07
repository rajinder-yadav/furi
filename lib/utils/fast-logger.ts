/**
 * Furi - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016 - 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import path from 'node:path';
import fs from 'node:fs';
import { Worker } from 'node:worker_threads';

import {
  LoggerMode,
  LogLevel,
  LogLevelOrdinal,
  mapToLogLevelRank
} from '../types';
// import { LOG_DEBUG } from '../furi';

/**
 * Stream logging class that uses a worker thread for asynchronous logging.
 * Optionally logs can be buffered to optimize file writes.
 * The worker thread handles the actual writing to the filesystem.
 * It also supports different log levels and modes for handling
 * the output of the logs
 */
export class FastLogger {

  private readonly worker: Worker;
  private readonly logLevelRank: number;

  private active = true;

  constructor(
    protected readonly logDirectory: string,
    protected readonly logFileName: string,
    protected enable: boolean,
    protected terminal: boolean,
    protected flushPeriod: number,
    protected logMaxCount: number,
    protected logMode: LoggerMode,
    protected logLevel: string,
    protected rollover: number,
  ) {
    this.logLevelRank = mapToLogLevelRank[logLevel];

    if(this.enable && !fs.existsSync(this.logDirectory)){
      // LOG_DEBUG(`Creating log directory ${this.logDirectory}`);
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }

    const filename = path.join(this.logDirectory, this.logFileName);

    // TODO: Fix
    // const dirName = (import.meta || globalThis.Deno) ? import.meta.dirname ?? '' : path.dirname(__filename);
    const dirName = path.dirname(__filename);
    this.worker = new Worker(path.join(dirName, 'worker-logger.js'), {
      workerData: {
        filename: filename,
        terminal: this.terminal,
        enable: this.enable,
        flushPeriod: this.flushPeriod,
        logMaxCount: this.logMaxCount,
        logMode: this.logMode,
        rollover: this.rollover,
      },
    });

    this.worker.on('error', (err) => {
      console.error('FastLogger::constructor Logger worker error:', err);
    });

    this.worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`FastLogger::constructor Logger worker stopped with exit code ${code}`);
      }
    });

  }

  close() {
    if (this.active) {
      // Send a null message to the worker to signal it to stop processing and exit.
      this.active = false;
      this.info('FastLogger::close Fast Logger closed.');
      this.info(null);
    }
  }

  debug(message: string | null) {
    if (this.logLevelRank <= LogLevelOrdinal.DEBUG) {
      this.worker.postMessage({ level: LogLevel.DEBUG, message });
    }
  }
  info(message: string | null) {
    if (this.logLevelRank <= LogLevelOrdinal.INFO) {
      this.worker.postMessage({ level: LogLevel.INFO, message });
    }
  }
  log(message: string | null) {
    if (this.logLevelRank <= LogLevelOrdinal.LOG) {
      this.worker.postMessage({ level: LogLevel.LOG, message });
    }
  }
  warm(message: string | null) {
    if (this.logLevelRank <= LogLevelOrdinal.WARN) {
      this.worker.postMessage({ level: LogLevel.WARN, message });
    }
  }
  error(message: string | null) {
    if (this.logLevelRank <= LogLevelOrdinal.ERROR) {
      this.worker.postMessage({ level: LogLevel.ERROR, message });
    }
  }
  critical(message: string | null) {
    if (this.logLevelRank <= LogLevelOrdinal.CRITICAL) {
      this.worker.postMessage({ level: LogLevel.CRITICAL, message });
    }
  }
  fatal(message: string | null) {
    if (this.logLevelRank <= LogLevelOrdinal.FATAL) {
      this.worker.postMessage({ level: LogLevel.FATAL, message });
    }
  }
}
