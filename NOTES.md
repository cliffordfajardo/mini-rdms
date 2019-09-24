







# JOIN

Trying to build my mental model of what NESTEDJOIN is going to do...
Before when we we're making single table queries, we we're fetching items
1 by one and passing them up the chain.

```
['NESTEDJOIN', 'movieId', 'movieId',
  ['PROJECTION', ['movieId', 'title'],
    ['FILESCAN', 'movies']
  ],w
  ['FILESCAN', 'ratings']
]
```