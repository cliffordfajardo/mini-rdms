`
SORT MERGE JOIN ALGO
-----------------------------------
TLDR:
- does share the nested for loop mechanism, the inner loop occurs on the match
- the sort part comes in because we want to sort both tables BEFORE we scan them,
  this makes it easier to walk down the table
- the merge comes in due to....


COST OF SORT-MERGE JOIN
-------------------------
- READ things into memory (1 scan)
  - quicksort in memory ...write to partitions on disk
  - READ newly written data back into memory
  - merge together    
`



`
SELECT * FROM Reserves R1,
              Sailors S1
         WHERE R1.sid =S1.sid

BELOW TABLES ARE ALREADY SORTED (notice ID's)
`

const reserves_table = [
  {sid: 22, sname: 'Anna'},
  {sid: 28, sname: 'Beth'},
  {sid: 31, sname: 'Cal'},
  {sid: 44, sname: 'Dan'},
  {sid: 58, sname: 'Erica'},
];
const sailors_table = [
  {sid: 28, rname: 'guppy'},
  {sid: 28, rname: 'yuppy'},
  {sid: 31, rname: 'dustin'},
  {sid: 31, rname: 'lubber'},
  {sid: 31, rname: 'lubber'},
  {sid: 58, rname: 'dustin'}
];

`
Sort algo
---------
1. Sort R on join attrs(s)
2. Sort S on join attrs(s)
3. Scan sorted-R and sorted S in tandem, to find matches 

- uses double for-loop!
- start on "reserves_table" id:22
  - in the inner loop start iterating over the sailors table
  - for each outer loop, we scan the entire sailors table




SORT MERGE IS GREAT WHEN....
-----------------------------
- 1 or both inputs (tables) are already sorted
- when someone wants the ouput sorted already
`

