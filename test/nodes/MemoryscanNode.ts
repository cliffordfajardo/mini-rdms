import { MemoryscanNode } from '../../src/nodes/MemoryscanNode';

// TEST DATA
const movies_table = [
  {movieId:"0", title: "Apple Computer History"},
  {movieId:"1", title: "Ben and Jerrys Documentary"}
];
const DatabaseInMemory = {"movies": movies_table}


describe('FilescanNodeInMemory -', () => {
  describe("Methods - ", () => {  
  
    describe('next - ', () => {
      it('should return a database record', () => {
        const filescan = new MemoryscanNode(DatabaseInMemory, 'movies');
        const result1 = filescan.next();
        expect(result1).toEqual(movies_table[0]);
      });
      
      it('should return null when there are no more records to available', () => {
        const filescan = new MemoryscanNode(DatabaseInMemory, 'movies');
        filescan.next();
        filescan.next();
        const result = filescan.next();
        expect(result).toEqual(null);
      });
    })

    // describe('reset', () => {
    //   it('', () => {

    //   })
    // });

  });
});
