export type primitive = number | string | boolean;

type column = {
  name: string;
  type: primitive;
  size: number;
};

type table = {
  name: string;
  columns: column[];
};


export const movies = {
  name: 'movies',
  columns: [
    {
      name: 'movieId',
      type: 'number',
      size: 4,
    },
    {
      name: 'title',
      type: 'string',
      size: 200,
    },
    {
      name: 'genres',
      type: 'string',
      size: 80,
    },
  ],
} as table;


export const ratings = {
  name: 'ratings',
  columns: [
    {
      name: 'userId',
      type: 'integer',
      size: 4
    },
    {
      name: 'movieId',
      type: 'integer',
      size: 4
    },
    {
      name: 'rating',
      type: 'float',
      size: 4
    },
    {
      name: 'timestamp',
      type: 'integer',
      size: 4
    }
  ]
} as table;