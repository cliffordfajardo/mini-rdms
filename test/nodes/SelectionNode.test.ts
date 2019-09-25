import { SelectionNode } from '../../src/nodes/SelectionNode';
import { MemoryscanNode } from "../../src/nodes/MemoryscanNode"



describe('SelectionNode -', () => {
  const movies_table = [
    {movieId: 0, title: "Apple Computer History"},
    {movieId: 1, title: "Ben and Jerrys Documentary"}
  ];
  const DatabaseInMemory = {"movies": movies_table}


  describe("Methods - ", () => {
    describe('next - ', () => {
      
      it('CASE(=) returns a record only if it matches the predicate function', () => {
        const fileScanNode = new MemoryscanNode(DatabaseInMemory, 'movies');
        const selectionNode = new SelectionNode(fileScanNode, '=', 'movieId', 0)

        const value = selectionNode.next();
        expect(value).toEqual({movieId: 0, title: "Apple Computer History"})
      });

      it('CASE(>) returns a record only if it matches the predicate function', () => {
        const fileScanNode = new MemoryscanNode(DatabaseInMemory, 'movies');
        const selectionNode = new SelectionNode(fileScanNode, '>', 'movieId', 0)

        const value = selectionNode.next();
        expect(value).toEqual({movieId: 1, title: "Ben and Jerrys Documentary"})
      });

      it('CASE(>=) returns a record only if it matches the predicate function', () => {
        const fileScanNode = new MemoryscanNode(DatabaseInMemory, 'movies');
        const selectionNode = new SelectionNode(fileScanNode, '>', 'movieId', 0)

        const value = selectionNode.next();
        expect(value).toEqual({movieId: 1, title: "Ben and Jerrys Documentary"})
      });


      it('CASE(<=) returns a record only if it matches the predicate function', () => {
        const fileScanNode = new MemoryscanNode(DatabaseInMemory, 'movies');
        const selectionNode = new SelectionNode(fileScanNode, '<=', 'movieId', 1)

        const value1 = selectionNode.next();
        expect(value1).toEqual({movieId: 0, title: "Apple Computer History"},)
        
        const value2 = selectionNode.next();
        expect(value2).toEqual({movieId: 1, title: "Ben and Jerrys Documentary"})
      });
      
      it('CASE(<) returns a record only if it matches the predicate function', () => {
        const fileScanNode = new MemoryscanNode(DatabaseInMemory, 'movies');
        const selectionNode = new SelectionNode(fileScanNode, '<', 'movieId', 1)

        const value1 = selectionNode.next();
        expect(value1).toEqual({movieId: 0, title: "Apple Computer History"},)
        
        const value2 = selectionNode.next();
        expect(value2).toEqual(null)
      });
      
    });

    // describe('reset', () => {
    //   it('', () => {

    //   })
    // });
  });
});
