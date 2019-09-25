import { MemoryscanNode } from '../../src/nodes/MemoryscanNode';
import { DistinctNode } from '../../src/nodes/DistinctNode';


describe('DistinctNode -', () => {

  describe("Methods - ", () => {

    // Distinct is expected to handle ordered repeated values
    describe('next - ', () => {
      it('For a sorted dataset, it should skip repeated items', () => {
        const movies_table = [
          {movieId:"0", title: "Apples"},
          {movieId:"1", title: "Apples"},
          {movieId:"2", title: "Bannas"}
        ];
        const DatabaseInMemory = {"movies": movies_table}

        const fileScanNode = new MemoryscanNode(DatabaseInMemory, 'movies');
        const distinctNode = new DistinctNode(fileScanNode, 'title')

        const result1 = distinctNode.next();
        const result2 = distinctNode.next();

        expect([result1, result2]).toEqual(expect.arrayContaining([
          {movieId:"0", title: "Apples"},
          {movieId:"2", title: "Bannas"}
        ]));
      });

      it('For an sorted dataset, by design, its not expected to skip repeated items', () => {
        // TEST DATA
        const movies_table = [
          {movieId:"0", title: "Apples"},
          {movieId:"1", title: "Apples"},
          {movieId:"2", title: "Bannas"},
          {movieId:"3", title: "Apples"},
        ];
        const DatabaseInMemory = {"movies": movies_table}

        const fileScanNode = new MemoryscanNode(DatabaseInMemory, 'movies');
        const distinctNode = new DistinctNode(fileScanNode, 'title')

        const result1 = distinctNode.next();
        const result2 = distinctNode.next();
        const result3 = distinctNode.next();

        expect([result1, result2, result3]).toEqual(expect.arrayContaining([
          {movieId:"0", title: "Apples"},
          {movieId:"2", title: "Bannas"},
          {movieId:"3", title: "Apples"},
        ]));
      });
    })


    // describe('reset', () => {
    //   it('', () => {

    //   })
    // });
  });
});
