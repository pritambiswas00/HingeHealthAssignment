import { z } from "zod";

/**
 * Schema for validation a new tree node.
 */
export const CREATE_NEW_TREE = z.object({
  parent: z
    .string({ required_error: "Parent must be  string" })
    .nonempty({ message: "Parent should not be empty" }),
  label: z
    .string({ required_error: "Label must be  string" })
    .nonempty({ message: "Label should not be empty" }),
});

/**
 * Serializes tree data into a hierarchical structure.
 * @param {Array} data - The tree data to be serialized.
 * @returns {Array} The serialized tree data.
 */
export const serializeData = (data) => {
  const serializedData = [];

  /**
   * Traverses a tree node and serializes it.
   * @param {object} node - The tree node to be serialized.
   * @returns {object} The serialized tree node.
   */
  function traverseNode(node) {
    const serializedNode = {};
    serializedNode[node.id] = {
      label: node.label,
      children: [],
    };

    if (node.children.length > 0) {
      node.children.forEach((child) => {
        serializedNode[node.id].children.push(traverseNode(child));
      });
    }
    return serializedNode;
  }
  data.forEach((item) => {
    serializedData.push(traverseNode(item));
  });

  return serializedData;
};
