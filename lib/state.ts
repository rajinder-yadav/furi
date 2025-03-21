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
import { LOG_DEBUG, LOG_ERROR } from "./types.ts";

import { DatabaseSync, StatementSync } from "node:sqlite";

/**
 * State Management for Furi.
 * Provides a global state management system for the application.
 */
export class StoreState {
  private readonly db: DatabaseSync = new DatabaseSync(":memory:");

  private readonly sqlInsert: StatementSync | null = null;
  private readonly sqlFind: StatementSync | null = null;
  private readonly sqlUpdate: StatementSync | null = null;
  private readonly sqlDelete: StatementSync | null = null;
  private readonly sqlDeleteAll: StatementSync | null = null;

  constructor() {
    // Create a SQLite database table for storing application state.
    try {
      this.db.exec(`
      CREATE TABLE IF NOT EXISTS FuriStateStore (
        key TEXT PRIMARY KEY,
        value TEXT);`
      );
      // Pre-compiled SQL CRUD statements to work with the FuriStateStore table.
      this.sqlInsert = this.db.prepare(`INSERT INTO FuriStateStore (key, value) VALUES (?, ?)`);
      this.sqlFind = this.db.prepare(`SELECT value FROM FuriStateStore WHERE key = ?`);
      this.sqlUpdate = this.db.prepare(`UPDATE FuriStateStore SET value = ? WHERE key = ?`);
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
  storeState(key: string, value: any): void;
  storeState(key: string, value?: any): any {
    if (value) {
      // Write mode entered.
      if (!this.sqlFind || !this.sqlInsert || !this.sqlUpdate || key.length <= 0) {
        LOG_ERROR(`StoreState::storeState invalid parameters.`);
        return;
      }
      // Search for value.
      try {
        const result: { value: string } = this.sqlFind.get(key) as { value: string };
        // LOG_DEBUG(`StoreState::storeState found entry for key=${key}, value=${result?.value}}.`)
        if (!result) {
          // Value does not exist. Insert it.
          // LOG_DEBUG(`StoreState::storeState inserting: ${key}=${value}.`);
          this.sqlInsert.run(key, value);
        } else {
          // Value exists. Update it.
          // LOG_DEBUG(`StoreState::storeState updating: ${key}=${value}.`);
          this.sqlUpdate.run(value, key);
        }
      } catch (error) {
        LOG_ERROR(`StoreState::storeState Exception caught, state: ${error}`);
      }
    } else {
      // Read mode endered.
      if (!this.sqlFind || key.length <= 0) { return; }
      const result: { value: string } = this.sqlFind.get(key) as { value: string };
      // LOG_DEBUG(`StoreState::storeState found entry for key=${key}, value=${result?.value}}.`);
      return result ? result.value : undefined;
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
}
