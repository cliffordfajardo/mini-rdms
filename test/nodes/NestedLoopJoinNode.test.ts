import { MemoryscanNode } from '../../src/nodes/MemoryscanNode';
import { NestedLoopJoinNode } from '../../src/nodes/NestedLoopJoinNode';

// TEST DATA
export const movies_table = [
  {movieId:"0", title: "Apples Movie"},
  {movieId:"1", title: "Bananas Movie"},
];
export const ratings_table = [
  {movieId:"0", rating: 3},
  {movieId:"1", rating: 4},
  {movieId:"0", rating: 5},
];
export const directors_table = [
  {movieId:"0", director: 'Adam'},
  {movieId:"1", director: 'Ben'},
];
const DatabaseInMemory = {"movies": movies_table, "ratings": ratings_table, 'directors': directors_table};


describe('NestedLoopJoinNode -', () => {
  // TODO: write a test for smaller left table column & right larger...simple example!...

  describe("Methods - ", () => {  
    describe('next - ', () => {
      it('should return back merged data ', () => {
        const filescan1 = new MemoryscanNode(DatabaseInMemory, 'movies');
        const filescan2 = new MemoryscanNode(DatabaseInMemory, 'ratings');
        const nestedLoopJoin = new NestedLoopJoinNode('movieId', 'movieId', filescan1, filescan2);

        const val1 = nestedLoopJoin.next()
        const val2 = nestedLoopJoin.next()
        const val3 = nestedLoopJoin.next()
        const val4 = nestedLoopJoin.next()
        
        expect([val1, val2, val3]).toEqual([
          {movieId: '0', title: 'Apples Movie', rating: 3 },
          {movieId: '0', title: 'Apples Movie', rating: 5 },
          {movieId: '1', title: 'Bananas Movie', rating: 4 }
        ]);
        expect(val4).toBe(null);
      });
    })

    // describe('reset', () => {
    //   it('it should all nodes down the chain',()=> {

    //   })
    // })

    // JOIN OVER 1 Table -- build intuiton
    //

    // TODO: implement a theta function too allow for these 2 cases:
    // 1) The join condition can be an inequality.
    // 2) The join condition can be that the value in one field equals another.

    describe('3-way join', () => {
      it('should allow the input to a join to be another join', () => {
        const filescan1 = new MemoryscanNode(DatabaseInMemory, 'movies');
        const filescan2 = new MemoryscanNode(DatabaseInMemory, 'ratings');
        const filescan3 = new MemoryscanNode(DatabaseInMemory, 'directors');
        const nestedLoopJoin1 = new NestedLoopJoinNode('movieId', 'movieId', filescan1, filescan2);
        const nestedLoopJoin2 = new NestedLoopJoinNode('movieId', 'movieId', filescan3, nestedLoopJoin1); // TODO: if nestedJoin is first, this will fail because the left table is bigger than the smaller one...

        const val1 = nestedLoopJoin2.next()
        const val2 = nestedLoopJoin2.next()
        const val3 = nestedLoopJoin2.next()
        const val4 = nestedLoopJoin2.next()
        
        expect([val1, val2, val3]).toEqual([
          {movieId: '0', title: 'Apples Movie',  rating: 3, director: 'Adam'},
          {movieId: '0', title: 'Apples Movie',  rating: 5, director: 'Adam'},
          {movieId: '1', title: 'Bananas Movie', rating: 4, director: 'Ben'}
        ]);
        expect(val4).toBe(null);
      })
    })


    // describe('reset', () => {
    //   it('', () => {

    //   })
    // });
  });
});
