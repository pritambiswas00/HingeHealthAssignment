export class DataSchema {
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