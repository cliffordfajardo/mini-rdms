import { InMemoryDB } from 'types/database-in-memory';

export const movies_table = [
  {movieId:"0", title: "Apple Computer History"},
  {movieId:"1", title: "Ben and Jerrys Documentary"},
  {movieId:"2", title: "Ben and Jerrys Documentary"},
];

// export const ratings_table = [
//   {movieid:0, name: "Apple Computer History"},
//   {movieid:1, name: "Ben and Jerrys Documentary"},
//   {movieid:2, name: "California's History"},
//   {movieid:3, name: "Delaware History and Why People Incorporate Here"}
// ];


export const DatabaseInMemory: InMemoryDB = {
  "movies": movies_table,
  // "ratings": ratings_table
}
