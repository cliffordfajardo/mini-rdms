import { BinarySearchTree } from "../../src/utils/binary-search-tree";

`
- The left subtree of a node contains only nodes with keys lesser than the node’s key.
- The right subtree of a node contains only nodes with keys greater than the node’s key.
- The left and right subtree each must also be a binary search tree.
`
describe('binarySearchTree', function() {

  describe("Methods", () => {
    describe('constructor', ()=> {
      it(`root must start with number`, () => {
        const bst = new BinarySearchTree(5);
        expect(typeof bst.value).toEqual('number')
      })
    })

    describe('insert', () => {
      it('should insert smaller values on the left and larger values for every node (AKA every node is a BST itself' ,() => {
        const bst = new BinarySearchTree(5);
        bst.insert(2);
        bst.insert(3);
        bst.insert(7);
        bst.insert(6);
        expect(bst.left.right.value).toEqual(3);
        expect(bst.right.left.value).toEqual(6);
        `
        2
        / \
            3
             \
              7
            /
           6
        `
      })
    })

    describe('contains', ()=> {
      it("should have a working 'contains' method", () => {
        const bst = new BinarySearchTree(5);
        bst.insert(2);
        bst.insert(3);
        bst.insert(7);
        expect(bst.contains(7)).toEqual(true);
        expect(bst.contains(8)).toEqual(false);        `
        2
        / \
            3
             \
              7
        `
      })
    });

    // describe('depthFirstLog', ()=> {
    //   it('should execute a callback on every value in a tree using "depthFirstLog"', () => {
    //     const bst = new BinarySearchTree(5);
    //     var array = [];
    //     var func = function(value){ array.push(value); };
    //     binarySearchTree.insert(2);
    //     binarySearchTree.insert(3);
    //     binarySearchTree.depthFirstLog(func);
    //     expect(array).to.eql([5,2,3]);
    //   })
    // })
  })
});