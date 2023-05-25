import request from "supertest";
import { DataBase } from "../DB/DataBase";
import { TreeService } from "../Module/TreeModule/TreeService";
import { TreeController } from "../Module/TreeModule/TreeController";
import { app } from "../index"

const database = DataBase.getInstance();
const treeService = new TreeService(database);
new TreeController(app, treeService, "../api");

describe("Server Test", () => {
  beforeAll(async () => {
    await database.createOne("root", "Test Tree 1");
    await database.createOne("root", "Test Tree 2");
  });

  it("should create a new tree if not exist otherwise it will push to its parent", async () => {
    const response = await request(app)
      .post("/api/tree")
      .send({ parent: "root", label: "New Tree" });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("succeed");
    expect(response.body.isCreated).toBeTruthy();
  });

  it("should return all tree structure data", async () => {
    const response = await request(app).get("/api/tree");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toBeDefined();
  });
});