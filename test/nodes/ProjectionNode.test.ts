import { MemoryscanNode } from '../../src/nodes/MemoryscanNode';
import { ProjectionNode } from "../../src/nodes/ProjectionNode";

// TEST DATA
const movies_table = [
  {movieId:"0", title: "Apple Computer History"},
  {movieId:"1", title: "Ben and Jerrys Documentary"}
];
const DatabaseInMemory = {"movies": movies_table}



describe('ProjectionNode -', () => {
  describe("Methods - ", () => {
    
    describe('next - ', () => {
      it("should return a record with only the fields in the columnList", () => {
        const fileScanNode = new MemoryscanNode(DatabaseInMemory, 'movies');
        const projectionNode = new ProjectionNode(fileScanNode, ['title']);

        const result1 = projectionNode.next();
        const result2 = projectionNode.next();
        expect(result1).toEqual({title: "Apple Computer History"})
        expect(result2).toEqual({title: "Ben and Jerrys Documentary"})
      })
    })

    // describe('reset', () => {
    //   it('', () => {

    //   })
    // });
  });
});
