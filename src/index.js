import express from "express";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import { DataBase } from "./DB/DataBase";
import { TreeController } from "./Module/TreeModule/TreeController";
import { TreeService } from "./Module/TreeModule/TreeService";

export const app = express();

/**
 * Bootstraps the application.
 * @param {object} app - The Express app instance.
 */
async function bootStrap(app) {
  let server;
  const port = 3001;

  // Middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );

  // Initialize the database
  const database = DataBase.getInstance();

  // Create and mount the TreeController with the TreeService
  new TreeController(app, new TreeService(database), "/api");

  // Start the server
  server = http.createServer(app);
  server.listen(port, () => {
    console.log("Server is up on port", port);
  });
}

bootStrap(app).catch((error) => {
  console.log(error);
  process.exit(1);
});
