import { DataSchema } from "../Schema/Data.schema";
import { randomUUID } from "crypto";

export class DataBase {
  /**
   * Constructs a DataBase instance.
   */
  static instance = null;
  constructor() {
    this.database = [];
  }

  /**
   * Retrieves the singleton instance of the DataBase.
   * @returns {DataBase} The singleton instance of the DataBase.
   */
  static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new DataBase();
    return this.instance;
  }

/**
 * Creates a new data entry.
 * @param {string} id - The ID of the data entry.
 * @param {string} label - The label of the data entry.
 * @returns {string} The generated ID of the data entry.
 * @throws {Error} If an error occurs during the execution.
 */
  async createOne(id, label) {
    try {
      const random_id = randomUUID();
      const foundNode = await this.#findById(id);
      if (foundNode) {
        foundNode.addChildren(new DataSchema(label, random_id));
        return random_id;
      } else {
        this.database.push(new DataSchema(label, id));
        return id;
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  /**
   * Finds a data entry by its ID.
   * @param {string} id - The ID of the data entry.
   * @returns {object|null} The found data entry or null if not found.
   */
  async #findById(id) {
    for (const data of this.database) {
      const foundNode = await this.#traverseNode(data, id);
      if (foundNode) return foundNode;
    }
    return null;
  }

  /**
   * Traverses the data entries to find a specific node by its ID.
   * @param {object} database - The current node to traverse.
   * @param {string} id - The ID of the data entry to find.
   * @returns {object|null} The found data entry or null if not found.
   */
  async #traverseNode(database, id) {
    if (database.id === id) return database;
    for (const child of database.children) {
      const found = await this.#traverseNode(child, id);
      if (found) return found;
    }
    return null;
  }

  /**
   * Retrieves all data entries in the database.
   * @returns {Array} The array of data entries.
   */
  findAll() {
    return this.database;
  }
}
