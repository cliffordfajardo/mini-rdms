export class BinarySearchTree {
  constructor(value) {
    this.left = null;
    this.right = null;
    this.value = value;
  }

  insert(value) {
    const recurseTree = function(node){
      if(node.value > value){
        if(node.left === null){
          node.left = new BinarySearchTree(value);
        } else {
          recurseTree(node.left);
        }
      } else {
          if(node.right === null){
            node.right = new BinarySearchTree(value);
          } else {
            recurseTree(node.right);
          }
        }
    };
    recurseTree(this);
  }


  contains(value) {
    const nodeInTree = false;
    const recurseTree = function(node) {
      if (node !== null){
        if (node.value === value) {
          nodeInTree = true;
        } else if (node.value > value) {
          recurseTree(node.left);
        } else {
          recurseTree(node.right);
        }
      }

    };
    recurseTree(this);
    return nodeInTree;
  }

  // IMAGE: https://medium.com/basecs/breaking-down-breadth-first-search-cebe696709d9
  depthFirstLog(func) {
    const recurseTree = function(node) {
      if (node !== null) {
        func(node.value);
        recurseTree(node.left);
        recurseTree(node.right);
      }
    };
    recurseTree(this);
  }

  /*
   * Complexity: What is the time complexity of the above functions?
   */
}