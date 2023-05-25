export class TreeService {
  /**
   * Constructs a TreeService instance.
   * @param {object} database - The database instance.
   */
  constructor(database) {
    this.database = database;
  }

  /**
   * Creates a new tree node.
   * @param {string} id - The ID of the parent node.
   * @param {string} label - The label of the new node.
   * @returns {string} The ID of the newly created node.
   * @throws {Error} If an error occurs during the creation process.
   */
  async createNew(id, label) {
    try {
      const newId = await this.database.createOne(id, label);
      return newId;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Retrieves all tree data.
   * @returns {Array} The array of tree data.
   */
  async findAll() {
    return this.database.findAll();
  }
}
