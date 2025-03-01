/**
 * FURI - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import path from "node:path";
import process from "node:process";
import { Worker } from 'node:worker_threads';

import { LoggerMode } from '../types.ts';

/**
 * Buffered logger class that uses a worker thread to handle logging.
 *
 */
export class BufferedLogger {

  private readonly worker: Worker;

  constructor(
    protected readonly logDirectory: string,
    protected readonly logFileName: string,
    protected enabled: boolean,
    protected flushPeriod: number,
    protected logMaxCount: number,
    protected logMode: LoggerMode
  ) {
    this.worker = new Worker(path.join(process.cwd(), 'lib/utils', 'logger-worker.ts'), {
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
    // Send a null message to the worker to signal it to stop processing and exit.
    this.log('BufferedLogger closed.');
    this.log(null);
  }

  log(message: string | null) {
    if (this.enabled) {
      this.worker.postMessage(message);
    }
  }
}
