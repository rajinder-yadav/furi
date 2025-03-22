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
import { LOG_INFO } from "./furi.ts";
import { LOG_DEBUG, LOG_ERROR, LOG_WARN } from "./types.ts";

import { DatabaseSync, StatementSync } from "node:sqlite";

/**
 * State Management for Furi.
 * Provides a global state management system for the application.
 */
export class GlobalStore {
  private readonly db: DatabaseSync | null = null;

  private readonly sqlInsert: StatementSync | null = null;
  private readonly sqlFind: StatementSync | null = null;
  private readonly sqlUpdate: StatementSync | null = null;
  private readonly sqlDelete: StatementSync | null = null;
  private readonly sqlDeleteAll: StatementSync | null = null;

  constructor(dbFilename?: string) {
    // Create a SQLite database table for storing application state.
    if (!dbFilename) {
      dbFilename = ":memory:";
    }

    try {
      this.db = new DatabaseSync(":memory:");
      this.db.exec(`
      CREATE TABLE IF NOT EXISTS FuriStateStore (
        key TEXT PRIMARY KEY,
        type TEXT,
        value TEXT);`
      );
      // Pre-compiled SQL CRUD statements to work with the FuriStateStore table.
      this.sqlInsert = this.db.prepare(`INSERT INTO FuriStateStore (key, type, value) VALUES (?, ?, ?)`);
      this.sqlFind = this.db.prepare(`SELECT value, type FROM FuriStateStore WHERE key = ?`);
      this.sqlUpdate = this.db.prepare(`UPDATE FuriStateStore SET value = ?, type = ? WHERE key = ?`);
      this.sqlDelete = this.db.prepare(`DELETE FROM FuriStateStore WHERE key = ?`);
      this.sqlDeleteAll = this.db.prepare(`DELETE FROM FuriStateStore`);
    } catch (err) {
      LOG_ERROR(`StoreState::constructor ${err}`);
    }
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
   * @return Application state value or undefined if not found.
   */
  storeState(key: string): any;
  storeState(key: string, value: unknown): void;
  storeState(key: string, value?: unknown): any {
    if (arguments.length === 2) {
      // Write mode entered.
      if (!this.sqlFind || !this.sqlInsert || !this.sqlUpdate || key.length <= 0) {
        LOG_ERROR(`StoreState::storeState invalid parameters.`);
        return;
      }

      let textValue: string | null = null;
      let valueType: string | null = null;
      if (typeof value === 'string') {
        valueType = 'string';
        textValue = value;
        LOG_DEBUG(`StoreState::storeState saving string ${textValue}`);
      } else if (typeof value === 'number') {
        valueType = 'number';
        if (value === Infinity) {
          textValue = 'Infinity';
        }
        else if (value === -Infinity) {
          textValue = '-Infinity';
        } else if (value !== value) {
          textValue = 'NaN';
        } else {
          textValue = value.toString();
        }
        LOG_DEBUG(`StoreState::storeState saving number ${textValue}`);
      } else if (typeof value === 'boolean') {
        valueType = 'boolean';
        textValue = value ? 'true' : 'false';
        LOG_DEBUG(`StoreState::storeState saving boolean ${textValue}`);
      } else if (typeof value === 'undefined') {
        valueType = 'undefined';
        textValue = 'undefined';
        LOG_DEBUG(`StoreState::storeState saving undefined ${textValue}`);
      } else if (Array.isArray(value)) {
        valueType = 'array';
        textValue = JSON.stringify(value);
        LOG_DEBUG(`StoreState::storeState saving Array ${textValue}`);
      } else if (typeof value === 'object') {
        valueType = 'object';
        if (value === null) {
          valueType = 'null';
          textValue = 'null';
        } else if ((value as object) instanceof Date) {
          valueType = 'date';
          textValue = value.toString();
        } else {
          textValue = JSON.stringify(value);
        }
        LOG_DEBUG(`StoreState::storeState saving object ${textValue}`);
      } else if (typeof value === 'bigint') {
        valueType = 'bigint';
        textValue = value.toString();
        LOG_DEBUG(`StoreState::storeState saving bigint ${textValue}`);
      } else {
        valueType = 'unknown';
        textValue = JSON.stringify(value);
        LOG_WARN(`StoreState::storeState saving unknown type ${typeof value}`);
      }

      // Search for value.
      try {
        const result: { value: string, type: string } = this.sqlFind.get(key) as { value: string, type: string };
        // LOG_DEBUG(`StoreState::storeState found entry for key=${key}, value=${result?.value}}.`)
        if (!result) {
          // Value does not exist. Insert it.
          // LOG_DEBUG(`StoreState::storeState inserting: ${key}=${value}.`);
          this.sqlInsert.run(key, valueType, textValue);
        } else {
          // Value exists. Update it.
          // LOG_DEBUG(`StoreState::storeState updating: ${key}=${value}.`);
          this.sqlUpdate.run(textValue, valueType, key);
        }
      } catch (error) {
        LOG_ERROR(`StoreState::storeState Exception caught, error: ${error}`);
      }
    } else {
      // Read mode endered.
      if (!this.sqlFind || key.length <= 0) { return; }
      const result: { value: string, type: string } = this.sqlFind.get(key) as { value: string, type: string };
      if (!result) {
        return undefined;
      }
      // LOG_DEBUG(`StoreState::storeState found entry for key=${key}, value=${result?.value}}.`);
      switch (result.type) {
        case 'string':
          return result.value;
        case 'number':
          return Number(result.value);
        case 'boolean':
          return result.value === 'true';
        case 'date':
          return new Date(result.value);
        case 'undefined':
          return undefined;
        case 'null':
          return null;
        case 'object':
          return result.value === 'null' ? null : JSON.parse(result.value);
        case 'array':
          return JSON.parse(result.value);
        case 'bigint':
          return BigInt(result.value);
        default:
          {
            LOG_WARN(`StoreState::storeState read unknown type ${result.type}`);
            return result.value;
          }
      }
    }
  }

  /**
   * Delete an entry from the store state.
   * If the key does not exist, do nothing.
   *
   * @param key Value to be removed from the store state.
   * @returns void.
   */
  storeStateDelete(key: string): void {
    if (!this.sqlFind || !this.sqlDelete || key.length <= 0) {
      LOG_ERROR(`StoreState::storeStateDelete key or database is invalid.`);
      return;
    }
    try {
      const result: { value: string } = this.sqlFind.get(key) as { value: string };
      // LOG_DEBUG(`StoreState::storeStateDelete found entry for key=${key}, value=${result?.value}}.`)
      if (result) {
        // LOG_DEBUG(`StoreState::storeStateDelete deleting entry for key: ${key}`);
        this.sqlDelete.run(key);
      } else {
        // LOG_DEBUG(`StoreState::storeStateDelete found no entry for key: ${key}`);
      }
    } catch (error) {
      LOG_ERROR(`StoreState::storeStateDelete Exception caught, state: ${error}`);
    }
  }

  /**
   * Reset the entire storage. This will delete all entries in the database table.
   * Sqlite3 does not have a TRUNCATE SQL command.
   */
  storeStateReset(): any {
    try {
      if (this.sqlDeleteAll) {
        // LOG_DEBUG(`StoreState::storeStateReset deleting all entries.`);
        this.sqlDeleteAll.run();
      }
    } catch (error) {
      LOG_ERROR(`StoreState::storeStateReset Exception caught, state: ${error}`);
    }
  }

  /**
   * Close Sqlite3 database for a gracefully shutdown.
   */
  shutDown() {
    if (this.db) {
      LOG_INFO(`StoreState::shutDown Closing database connection...`);
      this.db.close();
      LOG_INFO(`StoreState::shutDown Database connection closed.`);
    }
  }
}
