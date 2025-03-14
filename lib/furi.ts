/**
 * Furi - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

// deno-lint-ignore-file no-explicit-any
import * as fs from 'node:fs';
import * as http from 'node:http';
import { Server } from 'node:http';
import process from "node:process";
import YAML from 'npm:yaml';

import { FuriRouter } from './furi-router.ts';
import {
  API_VERSION,
  FuriConfig,
  LoggerMode,
  MapOf,
  LogLevels,
  LOG_INFO,
  LOG_ERROR,
} from './types.ts';

import { StoreState } from './state.ts';
import { FastLogger } from './utils/fast-logger.ts';
import {
  BodyParserFn,
  JSONBodyParserFn,
  UrlEncodedParserFn,
  BodyParserOptions,
} from './middlewares/body-parser/body-parser.ts';

// Re-export types and classes for applications
export * from './types.ts';
export * from './application-context.ts';
export * from './furi-router.ts';
export * from './utils/http-cookies-store.ts';
export * from './utils/time-period.ts';
export * from './middlewares/cors/cors.ts';

type CleanupHandler = () => void;

/**
 * SIGINT (Signal Interrupt)
 * Signal Number: 2
 * Description: Sent to a process when the user types the interrupt character (usually Ctrl+C) at the terminal.
 * Default Action: Terminates the process.
 * Example: Stopping a running program from the terminal.
 */
process.once('SIGINT', () => {
  // Handler Linux signal to perform clean shutdown.
  Furi.shutDown(5000);
});
/**
 * Signal Number: 15
 * Description: A request to terminate a process. This signal can be caught and handled by the process.
 * Default Action: Terminates the process.
 * Example: kill <pid> to gracefully terminate a process.
*/
process.once('SIGTERM', () => {
  // Handler Linux signal to perform clean shutdown.
  Furi.shutDown(5000);
});

/**
 * Router Class, matches URI for fast dispatch to handler.
 */
export class Furi extends FuriRouter {

  static fastLogger: FastLogger;

  static readonly appStore: StoreState = new StoreState();
  static readonly httpServer: { app: Furi, http: Server }[] = [];

  static readonly BodyParser: (options?: BodyParserOptions) => any = BodyParserFn;
  static readonly JSONBodyParser: (options?: BodyParserOptions) => any = JSONBodyParserFn;
  static readonly UrlEncodedParser: (options?: BodyParserOptions) => any = UrlEncodedParserFn;

  protected server: Server | null = null;
  protected properties: MapOf<any> = {};

  // Shutdown cleanup handler callback.
  cleanupHandler: CleanupHandler | null = null;

  // Default server configuration.
  private furiConfig: FuriConfig = {
    server: {
      env: 'development',
      port: 3030,
      host: 'localhost',
      callback: null,
    },
    logger: {
      enabled: false,
      terminal: false,
      flushPeriod: 1000,
      logFile: 'furi.log',
      maxCount: 100,
      mode: 'stream' as const,
      level: LogLevels.INFO,
    },
  };

  constructor() {
    super();

    // Read default configuration values.
    let { env, port, host, callback } = this.furiConfig.server;

    let { enabled, terminal, flushPeriod, maxCount, mode, logFile, level } = this.furiConfig.logger;

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
        // Server values.
        this.properties = YAML.parse(data);
        if (this.properties.server) {
          port = this.properties.server.port ?? port;
          host = this.properties.server.host ?? host;
          env = this.properties.server.env ?? env;
        }

        // Logger values.
        if (this.properties.logger) {
          enabled = this.properties.logger.enabled ?? enabled;
          terminal = this.properties.logger.terminal ?? terminal;
          flushPeriod = this.properties.logger.flushPeriod ?? flushPeriod;
          maxCount = this.properties.logger.maxCount ?? maxCount;
          mode = this.properties.logger.mode as LoggerMode ?? mode as LoggerMode;
          logFile = this.properties.logger.logFile ?? logFile;
          level = this.properties.logger.level?.toUpperCase() ?? level;
        }

        // Update configuration values.
        this.furiConfig = {
          server: { env, port, host, callback },
          logger: { enabled, terminal, flushPeriod, logFile, maxCount, mode, level },
        };
      }

      Furi.fastLogger = new FastLogger(
        process.cwd(),
        logFile,
        enabled,
        terminal,
        flushPeriod,
        maxCount,
        mode,
        level
      );
    } catch (error) {
      // Ignore and file errors.
      LOG_ERROR(`Furi::constructor error: ${JSON.stringify(error)}`);
    }

    this.furiConfig.server.callback = () => {
      const serverMessage = this.getServerStartupMessage();
      const serverInfoMessage = this.getServerInfoMessage();
      const loggerInfoMessage = this.getLoggerInfoMessage();
      const runtimeInfoMessage = this.getRuntimeMessage();
      if (Furi.fastLogger) {
        Furi.fastLogger.info(serverMessage);
        Furi.fastLogger.info(serverInfoMessage);
        Furi.fastLogger.info(runtimeInfoMessage);
        Furi.fastLogger.info(loggerInfoMessage);
      }
      console.log(serverMessage);
      console.log(serverInfoMessage);
      console.log(runtimeInfoMessage);
      console.log(loggerInfoMessage);
    }
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

  static info(message: string) {
    if (Furi.fastLogger) {
      Furi.fastLogger.info(message);
    }
  }

  /**
   * Perform clean shutdown.
   */
  static shutDown(exitTimer: number) {
    console.log();
    LOG_INFO('SIGINT signal received, goodbye!');
    LOG_INFO('Shutdown started...');
    // Close the HTTP server.

    // Close all Furi applications and their HTTP servers gracefully.
    Furi.httpServer.forEach((serverRef) => {
      LOG_INFO('Furi server shutting down...');
      if (serverRef.app.cleanupHandler) {
        LOG_INFO('Cleanup started...');
        serverRef.app.cleanupHandler();
        LOG_INFO('Cleanup completed.');
      }
      LOG_INFO('HTTP connection closing...');
      serverRef.http.close();
      LOG_INFO('HTTP connection closed.');
      LOG_INFO('Furi server shutdown completed.');
    });

    LOG_INFO('Shutdown completed.');
    if (Furi.fastLogger) {
      Furi.fastLogger.close();
    }

    // Delay to allow asynchronous processing to complete.
    setTimeout(() => {
      process.exit(1);
    }, exitTimer);
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
    return `Furi (v${API_VERSION})`;
  }

  /**
   * Start server with specified configuration.
   *
   * @param serverConfig  Configuration object for the server.
   * @returns Instance of http.Server.
   */
  listen(serverConfig: FuriConfig): Server {

    let { env, port, host, callback } = serverConfig.server;

    // Update running server config properties.
    if (env) { this.furiConfig.server.env = env; }
    if (port) { this.furiConfig.server.port = port; }
    if (host) { this.furiConfig.server.host = host; }
    if (callback) { this.furiConfig.server.callback = callback; }

    if (!callback) {
      callback = this.furiConfig.server.callback;
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

    // Node.js HTTP server list used to perform a clean close before exiting the process.
    Furi.httpServer.push({ app: this, http: this.server });
    return this.server;
  }

  /**
   * Startup server message based on current server configuration.
   *
   * @returns Server message string.
   */
  private getServerStartupMessage() {
    return `Furi Server (v${API_VERSION}) started.`;
  }

  /**
   * Startup Server info message based on current server configuration.
   *
   * @returns Server configuration string.
   */
  private getServerInfoMessage() {
    const { env, port, host } = this.furiConfig.server;
    return `Server { host: ${host}, port: ${port}, mode: ${env} }`;
  }

  /**
   * Startup Logger info message based on current server configuration.
   *
   * @returns Logger configuration string.
   */
  private getLoggerInfoMessage() {
    const { enabled, flushPeriod, logFile, maxCount, mode, level } = this.furiConfig.logger;
    return `Logger { enabled: ${enabled}, level: ${level}, logFile: ${logFile}, mode: ${mode}, flushPeriod: ${flushPeriod}ms, maxCount: ${maxCount} }`;
  }

  /**
   * Startup runtime info Furi is running under.
   *
   * @returns Runtime info string.
   */
  private getRuntimeMessage() {
    let runtimeMessage: string;
    if (globalThis.Deno) {
      const { deno, v8, typescript } = globalThis.Deno.version;
      runtimeMessage = `Runtime { deno: ${deno}, v8: ${v8}, typescript: ${typescript} }`;
    } else {
      const { node, v8 } = process.versions;
      runtimeMessage = `Runtime { node: ${node}, v8: ${v8} }`;
    }
    return runtimeMessage;
  }

  /**
   * Register cleanup handler to be called during server shutdown.
   *
   * @param callback Cleanup Function to call.
   */
  preShutdown(callback: () => void) {
    this.cleanupHandler = callback;
  }

}
