/**
 * FURI - Fast Uniform Resource Identifier.
 *
 * The Fast and Furious Node.js Router.
 * Copyright(c) 2016, 2025 Rajinder Yadav.
 *
 * Labs DevMentor.org Corp. <info@devmentor.org>
 * This code is released as-is without warranty under the "GNU GENERAL PUBLIC LICENSE".
 */

// deno-lint-ignore-file no-process-globals ban-types no-explicit-any
import * as http from "node:http";
import { Server } from "node:http";

import { FuriRouter } from './furi-router.ts';
import {
  FuriConfig,
  MapOfANY,
  API_VERSION
} from './types.ts';

// Re-export types and classes for applications
export * from './types.ts';
export * from './application-context.ts';
export * from './furi-router.ts';

/**
 * Router Class, matches URI for fast dispatch to handler.
 */
export class Furi extends FuriRouter {

  protected static readonly app: Furi = new Furi();

  // Default server configuration.
  private readonly furiConfig: FuriConfig = {
    env: 'development',
    port: 3030,
    host: 'localhost',
    callback: null
  };

  private readonly store: MapOfANY = {};

  constructor() {
    super(Furi.app);

    let { env, port, host, callback } = this.furiConfig;

    if (Deno?.version.deno) {
      // LOG_DEBUG('Running under Deno');
      env = Deno.env.get('env') || env;
      port = Number(Deno.env.get('port')) || port;
      host = Deno.env.get('host') || host;
    } else {
      // LOG_DEBUG('Running under Node.js');
      env = process.env.env || env;
      port = Number(process.env.port) || port;
      host = process.env.host || host;
    }

    callback = () => { console.log(this.getServerStartupMessage()); }
    this.furiConfig = { env, port, host, callback };
  }

  /**
   * Class static method. Create instance of Router object.
   * @returns Instance of class Furi.
   */
  static create(): Furi {
    // LOG_DEBUG(Furi.getApiVersion());
    return Furi.app;
  }

  static router(): FuriRouter {
    return new FuriRouter(Furi.app);
  }

  /**
   * Get Router API version.
   * @returns API version as a string.
   */
  static getApiVersion(): string {
    return `FURI (v${API_VERSION})`;
  }

  /**
   * Global Application state.
   * Overloaded functions to read or set application state.
   *
   * Read application state data.
   * Set application state data.
   *
   * @param key The application state key.
   * @param value The application state value.
   * @return Application state value or undefined if not found, when value is not provided.
   */
  storeState(key: string): any;
  storeState(key: string, value: any): void;
  storeState(key: string, value?: any): any {
    if (value) {
      this.store[key] = value;
    } else {
      return this.store[key];
    }
  }

  /**
   * Start server with specified configuration.
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
   * @returns Instance of http.Server.
   */
  start(_callback?: () => void): Server {
    return this.listen(this.furiConfig);
  }

  /**
   * Startup message based on current server configuration.
   * @returns Server configuration string.
   */
  private getServerStartupMessage() {
    const { env, port, host } = this.furiConfig;
    return `FURI Server { host: '${host}', port: ${port}, mode: '${env}' }`
  }

  /**
   * Node requires a handler function for incoming HTTP request.
   * This handler function is usually passed to createServer().
   * @returns Reference to request handler function.
   */
  private handler(): Function {
    return this.dispatch.bind(this);
  }

}
