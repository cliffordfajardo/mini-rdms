import { TupleSerializer } from "../src/TupleSerializer";
import { movies } from "../src/Schema"




describe('Tuple Serializer -', () => {
  describe("Methods - ", () => {
    describe('serialize (string)',() => {
      const serializer = new TupleSerializer();
      const result = serializer.serialize(movies, {movieId:1, title:"Apple", genres: "Action"});
      const expectedResult = serializer.deserialize(movies, result);
      expect(result).toEqual(expectedResult);
    });

  });
});

