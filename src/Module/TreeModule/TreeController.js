import { z } from "zod";
import { CREATE_NEW_TREE, serializeData } from "./TreeReqest.dto";

export class TreeController {
  /**
   * Constructs a TreeController instance.
   * @param {object} appModule - The Express application module.
   * @param {object} service - The service responsible for handling tree operations.
   * @param {string} prefix - The prefix for the API endpoints.
   */
  constructor(appModule, service, prefix) {
    this.service = service;
    this.appModule = appModule;
    this.prefix = prefix;
    this.initApis();
  }

  /**
   * Initializes the API endpoints.
   */

  initApis() {
    this.appModule.post(
      this.prefix + "/tree",
      async (...args) => await this.createNew(...args)
    );
    this.appModule.get(
      this.prefix + "/tree",
      async (...args) => await this.getAllData(...args)
    );
  }

  /**
   * Handles the GET request to retrieve all tree data.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {function} _ - The next middleware function (unused).
   * @returns {object} The response containing the status and data.
   */
  async getAllData(req, res, _) {
    try {
      let allData = await this.service.findAll();
      allData = serializeData(allData);
      return res.status(200).json({
        status: "success",
        data: allData,
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        error: error.message,
      });
    }
  }

  /**
   * Handles the POST request to create a new tree node.
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {function} _ - The next middleware function (unused).
   * @returns {object} The response containing the status and result of the creation operation.
   */
  async createNew(req, res, _) {
    try {
      const parsed = CREATE_NEW_TREE.safeParse(req.body);
      if (parsed.success) {
        const newData = await this.service.createNew(
          parsed.data.parent.trim(),
          parsed.data.label
        );

        return res.status(201).json({ status: "succeed", isCreated: newData });
      } else {
        const error = parsed.error.flatten().fieldErrors;
        return res.status(400).json({
          status: "failed",
          error: error,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        error: error.message,
      });
    }
  }
}
