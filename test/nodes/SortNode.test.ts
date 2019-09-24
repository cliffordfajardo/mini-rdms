import { MemoryscanNode } from '../../src/nodes/MemoryscanNode';
import { SortNode } from '../../src/nodes/SortNode';

const movies_table = [
  {movieId: 1, title: "Banana", inStock: true},
  {movieId: 0, title: "Apple", inStock: false},
  {movieId: 2, title: "Carrots", inStock: true}
];

const DatabaseInMemory = {"movies": movies_table}


describe('SortNode -', () => {
  describe("Methods - ", () => {
    
    describe('next - ', () => {
      it('CASE(asc) - should sort records on the first call to `next` ', () => {
        const sortedRecords = [
          {movieId: 0, title: "Apple", inStock: false},
          {movieId: 1, title: "Banana", inStock: true}, 
          {movieId: 2, title: "Carrots", inStock: true}
        ];

        const fileScanNode = new MemoryscanNode(DatabaseInMemory, 'movies');
        const sortNode = new SortNode(fileScanNode, 'title', 'ASC');
        const result1 = sortNode.next();
        const result2 = sortNode.next();
        const result3 = sortNode.next();
        const result4 = sortNode.next();
        expect(result1).toBeUndefined();
        expect(sortedRecords).toEqual([result2,result3, result4])
      })
    })
  });
});
