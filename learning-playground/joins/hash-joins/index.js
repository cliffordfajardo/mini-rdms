`
HASH JOIN ALGORITHM
-----------------------------------
- generate hash partitions for table_1 & table_2
  - all the "Apples" of table_1 will be in on place
  - all the "Oranges" of table_1 will be in once place
  - all the "Apples" of table_2 will be in once place
  - all the "Oranges" of table_1 will be in once place
- now do "Apple" to "Apple" joins & "Oranges" to "Oranges" join

THEN

build an in memory hash table... (you want to do this ideally for the smaller table)
  - bring in a partition of table_1, put it in the in memort hashtable
  - next, we stream table_2 with the help of our input buffer
    - for each tuple/row of table_2 do a hashtable look up for matches.

The builder table (the one we create an in-memory hashtable) should be small
The probing table can be HUUUGE, we're just streaming its data..
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
If the builder table can fit ALL in memory, we don't need to partition, just create the in-memory hashtable
  - 1 pass for builder
  - 1 pass for the streaming table..



BUT if we are 1 tuple over, we need to partition =/
`




`
HYBRID HASH JOINS
--------------------------------
- keep one of the hash buckets in memory   
`