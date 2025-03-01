/**
 * FURI - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

import * as fs from 'node:fs';
import * as http from 'node:http';
import { Server } from 'node:http';
import process from "node:process";
import YAML from 'npm:yaml';

import { FuriRouter } from './furi-router.ts';
import {
  API_VERSION,
  FuriConfig,
  MapOf,
} from './types.ts';

import { StoreState } from './state.ts';
import { BufferedLogger } from './utils/buffered-logger.ts';

// Re-export types and classes for applications
export * from './types.ts';
export * from './application-context.ts';
export * from './furi-router.ts';

process.once('SIGINT', () => {
  Furi.bufferedLogger.log('SIGINT signal received, goodbye!');
  Furi.bufferedLogger.close();
  setTimeout(() => { process.exit(1); }, 1000); // Forcibly exit if not exited after 250ms
});

/**
 * Router Class, matches URI for fast dispatch to handler.
 */
export class Furi extends FuriRouter {

  static bufferedLogger: BufferedLogger;

  static readonly appStore: StoreState = new StoreState();

  protected server: Server | null = null;
  protected properties: MapOf<any> = {};

  // Default server configuration.
  private furiConfig: FuriConfig = {
    env: 'development',
    port: 3030,
    host: 'localhost',
    callback: null,
    logger: {
      enabled: false,
      flushPeriod: 1000,
      logFile: 'furi.log',
      maxCount: 100,
      mode: 'buffered' as const,
    },
  };

  constructor() {
    super();

    // Set defaults.
    let { env, port, host, callback } = this.furiConfig;

    /**
     * Read server configuration properties from furi.yaml or furi.yml file.
     */
    try {
      let data: string | null = null;
      if (fs.existsSync('./furi.yaml') && fs.statSync('./furi.yaml').isFile()) {
        data = fs.readFileSync('./furi.yaml', 'utf8');
      } else if (fs.existsSync('./furi.yml') && fs.statSync('./furi.yml').isFile()) {
        data = fs.readFileSync('./furi.yml', 'utf8');
      }
      if (data !== null) {
        this.properties = YAML.parse(data);
        port = this.properties?.server.port ?? port;
        host = this.properties?.server.host ?? host;
        env = this.properties?.server.env ?? env;

        this.furiConfig.logger.enabled = this.properties?.logger.enabled ?? this.furiConfig.logger.enabled;
        this.furiConfig.logger.flushPeriod = this.properties?.logger.flushPeriod ?? this.furiConfig.logger.flushPeriod;
        this.furiConfig.logger.maxCount = this.properties?.logger.maxCount ?? this.furiConfig.logger.maxCount;
        this.furiConfig.logger.mode = this.properties?.logger.mode ?? this.furiConfig.logger.mode;
        this.furiConfig.logger.logFile = this.properties?.logger.logFile ?? this.furiConfig.logger.logFile;
      }

      Furi.bufferedLogger = new BufferedLogger(
        process.cwd(),
        this.furiConfig.logger.logFile,
        this.furiConfig.logger.enabled,
        this.furiConfig.logger.flushPeriod,
        this.furiConfig.logger.maxCount,
        this.furiConfig.logger.mode
      );
    } catch (error) {
      // Ignore and file errors.
    }

    callback = () => {
      const message = this.getServerStartupMessage();
      Furi.bufferedLogger.log(message);
      console.log(message);
    }
    this.furiConfig = { ...this.furiConfig, env, port, host, callback };

  }

  /**
   * Class static method. Create instance of Router object.
   *
   * @returns Instance of class Furi.
   */
  static create(): Furi {
    // LOG_DEBUG(Furi.getApiVersion());
    return new Furi();
  }

  /**
   * Create a new router.
   * @return Instance of class FuriRouter.
   */
  static router(): FuriRouter {
    return new FuriRouter();
  }

  /**
   * Get Router API version.
   *
   * @returns API version as a string.
   */
  static getApiVersion(): string {
    return `FURI (v${API_VERSION})`;
  }

  /**
   * Start server with specified configuration.
   *
   * @param serverConfig  Configuration object for the server.
   * @returns Instance of http.Server.
   */
  listen(serverConfig: FuriConfig): Server {

    let { env, port, host, callback } = serverConfig;

    // Update running server config properties.
    if (env) { this.furiConfig.env = env; }
    if (port) { this.furiConfig.port = port; }
    if (host) { this.furiConfig.host = host; }
    if (callback) { this.furiConfig.callback = callback; }

    if (!callback) {
      callback = this.furiConfig.callback;
    }

    const server: Server = http.createServer(this.handler());
    if (port && host && callback) {
      server.listen(port, host, callback);
    } else if (port && callback) {
      server.listen(port, callback);
    } else if (port && host) {
      server.listen(port, host);
    } else {
      server.listen(port);
    }

    return server;
  }

  /**
   * Starts the Furi server with default or provided configuration.
   *
   * @returns Instance of http.Server.
   */
  start(_callback?: () => void): Server {
    this.server = this.listen(this.furiConfig);
    return this.server;
  }

  /**
   * Startup message based on current server configuration.
   *
   * @returns Server configuration string.
   */
  private getServerStartupMessage() {
    const { env, port, host } = this.furiConfig;

    return `FURI Server (v${API_VERSION}) started { host: '${host}', port: ${port}, mode: '${env}' }`
  }

}
