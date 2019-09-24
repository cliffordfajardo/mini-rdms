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

// const query6 = ['NESTEDJOIN', 'movieId', 'movieId',
//   ['SELECTION', '=', 'title', 'Dark Knight Rises, The (2012)',
//     ['PROJECTION', ['movieId', 'title'],
//       ['FILESCAN', movies]
//     ]
//   ],
//   ['PROJECTION', ['rating', 'movieId'],
//     ['FILESCAN', ratings]
//   ]
// ]


const queryPlan4 = [
  ['SORT', 'title', 'ASC'],
  ['FILESCAN', 'movies']
];

let x = new Executor(queryPlan4);
let tmp;
while(tmp = x.next()){
  console.log(tmp);
}