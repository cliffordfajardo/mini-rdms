import { Executor } from "./executor";

/**
 * SELECT name FROM movies
 */
// const queryPlan0 = [
//   ["PROJECTION", ["name"]],
//   ["FILESCAN", "movies"]
// ];

/**
 * SELECT name FROM movies WHERE id = 5000
 */
// const queryPlan1 = [
//   ["PROJECTION", ["title"]],
//   ["SELECTION",  "=", "movieId", "2"],
//   ["FILESCAN", "movies"]
// ];

/**
 * SELECT rating FROM ratings WHERE movidId = 29
 */
// const queryPlan2 = [
//   ["AVERAGE"],
//   ["PROJECTION", ["rating"]],
//   ["SELECTION", "movie_id", "EQUALS", "29"],
//   ["FILESCAN",  ["ratings"]]
// ]

/**
 * SELECT movieId, title FROM movies WHERE movieId > 3000 
 */
// const queryPlan3 = [
//   ['SORT', 'title', 'ASC'],
//   ['SELECTION', '>', 'movieId', 3000],
//   ['DISTINCT', 'title'],
//   ['SORT', 'movieId', 'DESC'],
//   ['PROJECTION', ['movieId', 'title']],
//   ['FILESCAN', 'movies']
// ];

// const queryPlan6 = ['NESTEDJOIN', 'movieId', 'movieId',
//   ['SELECTION', '=', 'title', 'Dark Knight Rises, The (2012)',
//     ['PROJECTION', ['movieId', 'title'],
//       ['FILESCAN', 'movies']
//     ]
//   ],
//   ['PROJECTION', ['rating', 'movieId'],
//     ['FILESCAN', 'ratings']
//   ]
// ]


/**
 * @example
 * SELECT * FROM movies
 * JOIN ratings ON movies.movieId = ratings.movieId
 */
// const queryPlan7 = [
//   'NESTEDJOIN', 'movieId', 'movieId',
//   ['FILESCAN', 'movies'],
//   ['FILESCAN', 'ratings']
// ];

/**
 * @example
 * SELECT * FROM directors
 * JOIN movies ON movies.movidId = directors.movieId 
 * JOIN ratings ON ratings.movieId = movies.movieId
 * 
 * The query looks something like that... use PG query planner to verify..but thats the gist of it..
 * https://www.dofactory.com/sql/join
 */
const queryPlan8 = [
  'NESTEDJOIN', 'movieId', 'movieId',    
  ['FILESCAN', 'directors'],
  // NOTE! : My Nested JOIN Was failing when I was originally passing NESTEDJOIN FIRST
  //        I belive this has to do with the fact, that NESTED JOIN table has more rows
  //        then the other table . BEFORE (3, 2), AFTER (2,3) WRITE A TEST
  ['NESTEDJOIN', 'movieId', 'movieId',
    ['FILESCAN', 'movies'],
    ['FILESCAN', 'ratings'],
  ],
];


// const queryPlan4 = [
//   ['SORT', 'title', 'ASC'],
//   ['FILESCAN', 'movies']
// ];

let x = new Executor(queryPlan8); // the difference bewtween this implementation & braddb is that their Executors constructor function has this while loop.
let tmp;
while(tmp = x.next()){
  console.log(tmp);
}