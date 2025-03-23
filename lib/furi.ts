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
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import * as http from 'node:http';
import * as https from 'node:https';
import { Buffer } from 'node:buffer';
import { Server } from 'node:http';
import { Stream } from 'node:stream';
import { Server as ServerSecure } from 'node:https';
import process from "node:process";
import YAML from 'yaml';

import { FuriRouter } from './furi-router.ts';
import {
  API_VERSION,
  FuriConfig,
  // LOG_DEBUG,
  LOG_ERROR,
  LOG_INFO,
  LoggerMode,
  LogLevel,
  MapOf,
} from './types.ts';

import { Web, WebOptions } from './middlewares/web/web.ts';
import { Cors, CorsOptions } from './middlewares/cors/cors.ts';
import {
  BodyParserFn,
  BodyParserOptions,
  JSONBodyParserFn,
  UrlEncodedParserFn,
} from './middlewares/body-parser/body-parser.ts';

import { GlobalStore } from './global-store.ts';
import { FastLogger } from './utils/fast-logger.ts';


// Re-export types and classes for applications
export * from './application-context.ts';
export * from './furi-router.ts';
export * from './middlewares/cors/cors.ts';
export * from './middlewares/web/web.ts'
export * from './types.ts';
export * from './utils/http-cookies-store.ts';
export * from './utils/time-period.ts';

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

  static fastLogger: FastLogger | null = null;

  static readonly appStore: GlobalStore = new GlobalStore();
  static readonly httpServer: { app: Furi, http: Server | ServerSecure }[] = [];

  static readonly BodyParser: (options?: BodyParserOptions) => any = BodyParserFn;
  static readonly JSONBodyParser: (options?: BodyParserOptions) => any = JSONBodyParserFn;
  static readonly UrlEncodedParser: (options?: BodyParserOptions) => any = UrlEncodedParserFn;
  static readonly Cors: (options?: CorsOptions) => any = Cors;
  static readonly Web: (webOptions: WebOptions) => any = Web;

  protected server: Server | ServerSecure | null = null;
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
      secure: false,  // READONLY Flag, indicated secure connections (HTTPS).
    },
    logger: {
      enable: false,
      terminal: false,
      flushPeriod: 1000,
      logDir: './logs',
      logFile: 'furi.log',
      maxCount: 100,
      mode: 'stream' as const,
      level: LogLevel.INFO,
      rollover: 24 * 60 * 60 * 1000,
    },
  };

  constructor() {
    super();

    // Read default configuration values.
    let { env, port, host, callback, secure } = this.furiConfig.server;

    let {
      enable,
      flushPeriod,
      level,
      logDir,
      logFile,
      maxCount,
      mode,
      rollover,
      terminal,
    } = this.furiConfig.logger;

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
          enable = this.properties.logger.enable ?? enable;
          terminal = this.properties.logger.terminal ?? terminal;
          flushPeriod = this.properties.logger.flushPeriod ?? flushPeriod;
          maxCount = this.properties.logger.maxCount ?? maxCount;
          mode = this.properties.logger.mode as LoggerMode ?? mode as LoggerMode;
          logDir = this.properties.logger.logDir ?? logDir;
          logFile = this.properties.logger.logFile ?? logFile;
          level = this.properties.logger.level?.toUpperCase() ?? level;
          rollover = this.properties.logger.rollover
            ? this.properties.logger.rollover * 60 * 60 * 1000
            : rollover;
        }

        // EXPERIMENTAL CODE: Log roll over.
        if (this.properties.logger?.rollover) {
          try {
            if (fs.existsSync(logFile)) {
              const date = new Date();
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
              const dd = String(date.getDate()).padStart(2, '0');
              const h = String(date.getHours()).padStart(2, '0');
              const m = String(date.getMinutes()).padStart(2, '0');
              const s = String(date.getSeconds()).padStart(2, '0');

              // Peroform log rollover.
              const src = fs.createReadStream(logFile);
              const dest = fs.createWriteStream(`${logFile}.${yyyy}-${mm}-${dd}+${h}${m}${s}.log.gz`);
              const gzip = zlib.createGzip();
              src.pipe(gzip).pipe(dest);
              dest.on('finish', () => {
                src.close();
                dest.close();
                gzip.close();
              });
            }
          } catch (error) {
            // CONTINUE
          }
        }
        // Kick start the logger, so we can start logging.
        try {
          Furi.fastLogger = new FastLogger(
            path.join(process.cwd(), logDir),
            logFile,
            enable,
            terminal,
            flushPeriod,
            maxCount,
            mode,
            level,
            rollover,
          );
        }
        catch (error) {
          LOG_ERROR(`Furi::constructor Failed to initialize FastLogger: ${error}`);
          Furi.fastLogger = null;
        }

        // Update configuration values.
        this.furiConfig = {
          server: { env, port, host, callback, secure },
          logger: { enable, terminal, flushPeriod, logDir, logFile, maxCount, mode, level, rollover },
        };

        // SSL Certificate values.
        let key: string;
        let cert: string;
        let passphrase: string;
        let ca: string | string[];
        let rejectUnauthorized: boolean;
        let requestCert: boolean;

        if (this.properties.cert) {
          key = this.properties.cert.key;
          cert = this.properties.cert.cert;
          passphrase = this.properties.cert.passphrase;
          ca = this.properties.cert.ca;
          rejectUnauthorized = this.properties.cert.rejectUnauthorized;
          requestCert = this.properties.cert.requestCert;

          this.furiConfig.cert = { key, cert, passphrase, ca, rejectUnauthorized, requestCert };
          // LOG_DEBUG(`${JSON.stringify(this.furiConfig.cert)}`);

          if (key && cert) {
            LOG_INFO('Furi::constructor SSL key file propertey provided.');
            LOG_INFO('Furi::constructor SSL cert file propertey provided.');
          }
          if (passphrase) {
            LOG_INFO('Furi::constructor SSL passphrase propertey provided.');
          }
          if (ca) {
            LOG_INFO('Furi::constructor SSL CA file(s) propertey provided.');
          }

        }
      }

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
    LOG_INFO('Furi::shutDown SIGINT signal received, goodbye!');
    LOG_INFO('Furi::shutDown Shutdown started...');
    // Close the HTTP server.

    LOG_INFO('Furi::shutDown StoreState shutting down...');
    Furi.appStore.shutDown();
    LOG_INFO('Furi::shutDown StoreState stopped.');

    // Close all Furi applications and their HTTP servers gracefully.
    Furi.httpServer.forEach((serverRef) => {
      LOG_INFO('Furi::shutDown server shutting down...');
      if (serverRef.app.cleanupHandler) {
        LOG_INFO('Furi::shutDown Cleanup started...');
        serverRef.app.cleanupHandler();
        LOG_INFO('Furi::shutDown Cleanup completed.');
      }
      LOG_INFO('Furi::shutDown HTTP connection closing...');
      serverRef.http.close();
      LOG_INFO('Furi::shutDown HTTP connection closed.');
      LOG_INFO('Furi::shutDown server shutdown completed.');
    });

    LOG_INFO('Furi::shutDown Shutdown completed.');
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
   * @returns Instance of http.Server or https.Server.
   */
  listen(serverConfig: FuriConfig): Server | ServerSecure {

    let { env, port, host, callback } = serverConfig.server;
    const { key, cert, ca } = serverConfig?.cert ?? { key: null, cert: null };

    const passphrase = serverConfig?.cert?.passphrase;

    // Load SSL Certificate and Key.
    let sslKey: Buffer | null = null;
    let sslCert: Buffer | null = null;
    let sslCA: Buffer | Buffer[] | null = null;

    try {
      if (key && cert) {
        sslKey = fs.readFileSync(key);
        sslCert = fs.readFileSync(cert);
        LOG_INFO(`Furi::listen Read SSL key and certificate successfully.`);

        if (ca) {
          if (typeof ca === 'string') {
            sslCA = fs.readFileSync(ca);
            LOG_INFO(`Furi::listen Read SSL CA certificate successfully.`);
          } else if (Array.isArray(ca)) {
            sslCA = ca.map(caPath => fs.readFileSync(caPath));
            LOG_INFO(`Furi::listen Read ${sslCA.length} SSL CA certificates successfully.`);
          }
        }
        // Only set secure to true if both key and certs have been loaded successfully.
        this.furiConfig.server.secure = true;
      }
    } catch (error) {
      LOG_ERROR(`Furi::listen Failed to read SSL key or certificate: ${error}`);
      this.furiConfig.server.secure = false;
      sslKey = null;
      sslCert = null;
      sslCA = null;
    }

    // Update running server config properties.
    if (env) { this.furiConfig.server.env = env; }
    if (port) { this.furiConfig.server.port = port; }
    if (host) { this.furiConfig.server.host = host; }
    if (callback) { this.furiConfig.server.callback = callback; }

    if (!callback) {
      callback = this.furiConfig.server.callback;
    }

    let server: Server | ServerSecure | null = null;
    if (sslKey && sslCert) {
      if (passphrase && passphrase.length > 0) {
        // Signed SSL key and certificate with passphrase.
        LOG_INFO(`Furi::listen Creating a secure HTTPS server with SSL certificate with passphrase.`);
        server = https.createServer({ key: sslKey, cert: sslCert, passphrase }, this.handler());
      } else if (sslCA) {
        // SSL key, certificate and CA certificate.
        LOG_INFO('Furi::listen Creating a secure HTTPS server with SSL CA certificate.');
        server = https.createServer({ key: sslKey, cert: sslCert, ca: sslCA }, this.handler())
      } else {
        // SSL key and certificate.
        LOG_INFO('Furi::listen Creating a secure HTTPS server with SSL certificate.');
        server = https.createServer({ key: sslKey, cert: sslCert }, this.handler())
      }
    } else {
      // No SSL key and certificate.
      LOG_INFO('Furi::listen Creating a unsecure HTTP server.');
      server = http.createServer(this.handler());
    }

    // Handler error gracefully.
    server.on('clientError', (err: Error, socket: Stream.Duplex) => {
      if (socket.writable) {
        const responseError = (sslKey && sslCert) ?
          'HTTP/1.1 400 Bad Request\r\n\r\n' :
          'HTTPS/1.1 400 Bad Request\r\n\r\n';
        socket.end(responseError);
      }
      LOG_ERROR(`Furi::listen server::clientError ${err.message}`);
    });

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
   * @returns Instance of http.Server or https.Server.
   */

  start(_callback?: () => void): Server | ServerSecure {
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
    const { env, port, host, secure } = this.furiConfig.server;
    return `Server  { mode: ${secure ? 'https' : 'http'}, host: ${host}, port: ${port}, env: ${env} }`;
  }

  /**
   * Startup Logger info message based on current server configuration.
   *
   * @returns Logger configuration string.
   */
  private getLoggerInfoMessage() {
    const { enable, flushPeriod, logDir, logFile, maxCount, mode, level, rollover } = this.furiConfig.logger;
    return `Logger  { enable: ${enable}, level: ${level}, logFile: ${logDir}/${logFile}, mode: ${mode}, flushPeriod: ${flushPeriod}ms, maxCount: ${maxCount}, rollover: ${rollover / (60 * 60 * 1000)}h }`;
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
