# Javascript

# 1. Project Setup 
```
clone this repository and run npm install
```
  ## Compiles and start the server at port 5000 by default
  
```
 npm run start
 ```
   ## Run the Test
 ```
 npm run test
 ```
   ## Lint and Fixes Files 
 ```
 npm run lint
 ```


# 2. Schema That supports this tree type Data Structure

```
class DataBase {
  static instance = null;
  constructor() {
    this.database = [];
  }
  static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new DataBase();
    return this.instance;
  }
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
      console.log(error);
    }
  }
  async #findById(id) {
    for (const data of this.database) {
      const foundNode = await this.#traverseNode(data, id);
      if (foundNode) return foundNode;
    }
    return null;
  }
  async #traverseNode(database, id) {
    if (database.id === id) return database;
    for (const child of database.children) {
      const found = await this.#traverseNode(child, id);
      if (found) return found;
    }
    return null;
  }
  findAll() {
    return this.database;
  }
}
```

### This data schema that supports the DataBase

```
class DataSchema {
  constructor(label, id){
    this.label = label;
    this.children = new Array();
    this.id = id;
  }

  addChildren(child) {
      this.children.push(child);
      return true;
  }
}
```

# 3. Sample queries / code that would support the two routes

### This will get all the tree data
```
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
  ```

### This will create a new tree if provided parent is not there

```
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
  ```
