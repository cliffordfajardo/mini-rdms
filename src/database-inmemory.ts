import { InMemoryDB } from 'types/database-in-memory';

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

export const DatabaseInMemory: InMemoryDB = {
  "movies": movies_table,
  "ratings": ratings_table,
  "directors": directors_table
}
