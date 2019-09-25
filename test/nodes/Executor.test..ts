import { MemoryscanNode } from '../../src/nodes/MemoryscanNode';
import { Executor } from "../../src/executor"

// TEST DATA
const movies_table = [
  {movieId:"0", title: "Apple Computer History"},
  {movieId:"1", title: "Ben and Jerrys Documentary"}
];
const DatabaseInMemory = {"movies": movies_table}



describe.skip('Executor -', () => {
  describe("Methods - ", () => {
    describe('constructor', () => {
      it('upon instantiation, it should have its rootNode set', () => {

      })
    })
    describe('next - ', () => {
      it('should return results', () => {
        const filescan = new MemoryscanNode(DatabaseInMemory, 'movies');
        const result1 = filescan.next();
        expect(result1).toEqual(movies_table[0]);

      })
    });
    
    // describe('instantiateNodes', () => {
    //   it('should grab a queryPlanNode and instantiate it', () => {

    //   })
    // });
  });
});
