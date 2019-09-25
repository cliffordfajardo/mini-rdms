# Week 3 view database data - investigating the HEAP file (stores all the records)

### Create Table
```sh
psql
create table foo(id integer, age smallint, name varchar(50));

# View the table
\dt
```

### View where postgres data is stored on disk
```sh
show data_directory;

# cliffordfajardo=# show data_directory;
#      data_directory
# -------------------------
#  /usr/local/var/postgres
# (1 row)

cd /usr/local/var/postgres
cd base
ls
# 1     13381 13382 16384
```

Those numbers are essentially object ids that correspond to userspaces in postgres (namespace of databases)

### Find foo table

```sh
select pg_relation_filepath('foo')
# pg_relation_filepath
# ----------------------
#  base/16384/16385
```

Before we open this file `(base/16384/16385)` which represents a table with no records, how big do you think it is?

```sh
stat 16385
# 16777220 65894371 -rw------- 1 cliffordfajardo admin 0 0 "Sep 30 16:28:47 2019" "Sep 30 16:19:01 2019" "Sep 30 16:19:01 2019" "Sep 30 16:19:01 2019" 4096 0 0 16385
# its 0 bytes, its empry
```

### Lets add a row to the table

```sh
insert into foo values(5, 20, 'Donald duck')
stat 16385

# 16777220 65894371 -rw------- 1 cliffordfajardo admin 0 8192 "Sep 30 16:28:47 2019" "Sep 30 16:33:04 2019" "Sep 30 16:33:04 2019" "Sep 30 16:19:01 2019" 4096 16 0 16385
# its 8 bytes

# Behind the scenes, this gets added to the WAL (write ahead log) file first. We know that Postgres has a durability guarentee, if the power goes out, we have it in the WAL already.
# Its only periodically do we actually go to the diff and update the data
#  WAL    DB File
# |a  |   |   |
# |b  |   |a  |
#  ___    |   |  
#         |b  |
#         |___|
```
Advantages of WAL
- sequential writes vs random IO writing to to DB file
- we're ok with checkpointing and periodoically updating the file.
- used for undoing data as well

When we write data to the WAL it also gets added to the buffer pool


|a  |
|b  |
|___|

WAL       DB FILE
|a  |     |   |
|b  |     |a  |
 ___      |   |  
          |b  |
          |___|
Buffer Pool (RAM) reads and writes will go here first, if they are not there they will go to the DB file.
|   |
|   |
|___|
# Lets hexdump it to see the data?

```sh
# The 1st column represents an input offset.
hexdump -C 16385

# 00000000  00 00 00 00 a0 54 69 01  00 00 00 00 1c 00 d0 1f  |.....Ti.........|
# 00000010  00 20 04 20 00 00 00 00  d0 9f 54 00 00 00 00 00  |. . ......T.....|
# 00000020  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
# *                                                                 <-----------this means this is all zeros
# 00001fd0  3a 02 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |:...............|

                                      the 5 integer (4 bytes AKA 32bits)..this is little endiam...5 is the lowest order byte
                                      ________
                                     |        | integer 20
                                                 |   |
# 00001fe0  01 00 03 00 02 08 18 00  05 00 00 00 14 00 19 44  |...............D| <----44 is in fact D, NOTE there are 15 dots a..they map nicely
# 00001ff0  6f 6e 61 6c 64 20 64 75  63 6b 00 00 00 00 00 00  |onald duck......|
# 00002000                                                          <----------- 2000 in hexadecimal is 8k
```

We can't open a binary file in a text editor because it will interpret it in ascii or utf8, we need a hex editor.

Why read this in hexadecimal?
The idea is it's very hard to make sense of just a long string of binary 0 and 1s. Hex is more user friendly once you get use to it.
If you work with it enough, you'll memorize all the hex values as bit sequences

How much data does 2 hex characters represent?
- 1 digit = half a byte (a nibble)
- 2 digits = 1 byte  ()

so for this row, each pair is 1 byte 2nd column = 8 bytes  , 3rd column = 8 bytes so we can read a total of 16 bytes! (if we were reading binary that would be 16*8 126 zeros and 1s)
          
      first byte of the file
            |
# 00000000  00 00 00 00 a0 54 69 01  00 00 00 00 1c 00 d0 1f  |.....Ti.........| <----the far right column is hexdumps attempt to be helpful and interpret the data on the right as this as ascii
                                                                                      most of the characters are not ascii interpretable, but sometimes there just happens to be an ascii value.







# Forcing a checkpoint

```sh
> checkpoint;
CHECKPOINT
```

*What if our db connection goes out, will that foward a checkpoint?*
If other people try and access the data it will try and fetched from the buffer pool
if the system crashed and we reboot, the databases will not allow queries until will have transferred data from WAL to db file.

**How long can we let the WAL be?
- once we checkpoint, we can get everything that came before it.


**Can we configure the Buffer pool size?**
- Yes, if we have more RAM the better, of course there are other allocations which take up RAM too, like sorting and other ops.
- Oz on using AWS ..if you use a large enough machine on AWS, your buffer pool fills up with all the on disk pages, your still writing to WAL, but a whole lot
 faster than writing to the database table

 STOPED AT 34.08








 The Log Manger (sub system) would interact with WAL. The architectural aspect of it is that you don't want code all throughout the DMBMS that writes from the log and reads from the log.
 You want to abstract that away, just have functions to call. Same with accessing buffer pool pages, you don't to have code everywhere that just arbitrarily just reads from memoery,
 you want a buffer pool manager 




# Storing data:
CSV vs binary
- binary is compact, we don't need delimeters like in the CSV. We don't need a delimeter because know its an int followed by a short followed by a string.





### Inserting an additonal record

First here's the first record before we insert into the file again

```sh

hexdump -C 16385
# 00000000  00 00 00 00 a0 54 69 01  00 00 00 00 1c 00 d0 1f  |.....Ti.........|
# 00000010  00 20 04 20 00 00 00 00  d0 9f 54 00 00 00 00 00  |. . ......T.....|
# 00000020  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
# *                                                                 <-----------this means this is all zeros
# 00001fd0  3a 02 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |:...............|
# 00001fe0  01 00 03 00 02 08 18 00  05 00 00 00 14 00 19 44  |...............D| <----44 is in fact D, NOTE there are 15 dots a..they map nicely
# 00001ff0  6f 6e 61 6c 64 20 64 75  63 6b 00 00 00 00 00 00  |onald duck......|
# 00002000                                                          <----------- 2000 in hexadecimal is 8k
```

```sql
INSERT INTO foo values(258, -1, 'Donald duck')
INSERT 0 1
```

```sh
hexdump -C 16385
00000000  00 00 00 00 a0 54 69 01  00 00 00 00 1c 00 d0 1f  |.....Ti.........|
                                    start of record
                                  |          |
00000010  00 20 04 20 00 00 00 00  d0 9f 54 00 00 00 00 00  |. . ......T.....|
00000020  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
00001fd0  3a 02 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |:...............|
00001fe0  01 00 03 00 02 08 18 00  05 00 00 00 14 00 19 44  |...............D|
00001ff0  6f 6e 61 6c 64 20 64 75  63 6b 00 00 00 00 00 00  |onald duck......|



# It didn't write it directly
> checkpoint # inside psql
CHECKPOINT

            notice the header for the page changed when we added another record
          |----------------------------------------------|
00000000  00 00 00 00 78 57 69 01  00 00 00 00 20 00 a0 1f  |....xWi..... ...|
                                  
                                   1st index     2nd record
                                   |        |  |        |
00000010  00 20 04 20 00 00 00 00  d0 9f 54 00 a0 9f 54 00  |. . ......T...T.|
00000020  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*                                                                              <------ end of header..its a space
00001fa0  3b 02 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |;...............|
                                      258       -1 in 2s complement (we reserve half the range for negative)
                                   |        |  |   |
00001fb0  02 00 03 00 02 08 18 00  02 01 00 00 ff ff 19 44  |...............D|
00001fc0  6f 6e 61 6c 64 20 64 75  63 6b 00 00 00 00 00 00  |onald duck......|
00001fd0  3a 02 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |:...............|
00001fe0  01 00 03 00 02 08 18 00  05 00 00 00 14 00 19 44  |...............D|
00001ff0  6f 6e 61 6c 64 20 64 75  63 6b 00 00 00 00 00 00  |onald duck......|
00002000
```
- The records themselves each have their own header.What type of data might the header have?
  - whether there is free space 
  -----------------------
                    |x|y|
  _______________________
  x (end of header so we can keep writing)
  
  ________________________
  y pointer to where the records begin,so we can add more records...

  ------------------------

- the database page itself also has a header

page, index..it points to a row
(5, 3)


How do we represent null values for a record?
a null map inside the header for each tuple record. 
For example, if we have 3 fields 0 0 1 ...


scanning the record
      integer   smallint  string
0 0 0 [4bytes, 2 bytes, 1 byte]

0 1 0 [skip 4 bytes, got my value, skip 1 bye]

This is the page header....
https://github.com/postgres/postgres/blob/eb43f3d19324d7e5376b1f57fc2e5c142a6b5f3d/src/include/storage/bufpage.h#L151


### Updating a record
```sh
> UPDATE foo set name="Gerald Goose" where id = 258;
UPDATE 1
> checkpoint;
CHECKPOINT;

hexdump -C 16385
# the old record is maintained and we add a new one
00000000  00 00 00 00 b0 59 69 01  00 00 00 00 24 00 70 1f  |.....Yi.....$.p.|
00000010  00 20 04 20 3c 02 00 00  d0 9f 54 00 a0 9f 54 00  |. . <.....T...T.|
00000020  70 9f 56 00 00 00 00 00  00 00 00 00 00 00 00 00  |p.V.............|
00000030  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
00001f70  3c 02 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |<...............|
00001f80  03 00 03 80 02 28 18 00  02 01 00 00 ff ff 1b 47  |.....(.........G|
00001f90  65 72 61 6c 64 20 47 6f  6f 73 65 00 00 00 00 00  |erald Goose.....|
00001fa0  3b 02 00 00 3c 02 00 00  00 00 00 00 00 00 00 00  |;...<...........|
00001fb0  03 00 03 40 02 01 18 00  02 01 00 00 ff ff 19 44  |...@...........D|
00001fc0  6f 6e 61 6c 64 20 64 75  63 6b 00 00 00 00 00 00  |onald duck......|
00001fd0  3a 02 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |:...............|
00001fe0  01 00 03 00 02 09 18 00  05 00 00 00 14 00 19 44  |...............D|
00001ff0  6f 6e 61 6c 64 20 64 75  63 6b 00 00 00 00 00 00  |onald duck......|
00002000
```

So the id of the new record  (aka the update is 259..)

```sh
> DELTE FROM foo WHERE id=259;
DELETE 0
> checkpoint;
CHECKPOINT
```

```sh
hexdump -C 16385
# deletes and updates don't delete.... this is kept for concurrency control..modern dbs implement this
# we want to have snapshots od the world..
#
# example of 2 transacation
# 1st transacation - update...this guy should still be able to see old data
# 2nd  transaction - 
# MVCC - m
# we keep the transacation id as well to we know which transaction introduced what.....great concurrency scheme!
# before MMCC locking was worse..before we stoed multiple version...aggrssive locking was done on the database
#
# down stream consequences?
# when do we clean this up? with the `Vacum` command...transacations are over...no reason to keep this...
# but to re-write these tables its a slow operation ...we need to read whole database file and read it bit by bit.
# people usually do this late at night.......when could i do this ❓❓❓ For each user, I should have a metric for average time before the next execution...... I can do expensive updates and cleaning during this time
00000000  00 00 00 00 b0 59 69 01  00 00 00 00 24 00 70 1f  |.....Yi.....$.p.|
00000010  00 20 04 20 3c 02 00 00  d0 9f 54 00 a0 9f 54 00  |. . <.....T...T.|
00000020  70 9f 56 00 00 00 00 00  00 00 00 00 00 00 00 00  |p.V.............|
00000030  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
00001f70  3c 02 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |<...............|
00001f80  03 00 03 80 02 29 18 00  02 01 00 00 ff ff 1b 47  |.....).........G|
00001f90  65 72 61 6c 64 20 47 6f  6f 73 65 00 00 00 00 00  |erald Goose.....|
00001fa0  3b 02 00 00 3c 02 00 00  00 00 00 00 00 00 00 00  |;...<...........|
00001fb0  03 00 03 40 02 05 18 00  02 01 00 00 ff ff 19 44  |...@...........D|
00001fc0  6f 6e 61 6c 64 20 64 75  63 6b 00 00 00 00 00 00  |onald duck......|
00001fd0  3a 02 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |:...............|
00001fe0  01 00 03 00 02 09 18 00  05 00 00 00 14 00 19 44  |...............D|
00001ff0  6f 6e 61 6c 64 20 64 75  63 6b 00 00 00 00 00 00  |onald duck......|
```

# cleaning the table!

```sh
> vacuum full;
VACUUM

> hexdump -C 16385
# nothing

# instead it will create a new file..it would be tragic to do an in place one because if we failed, were screweed

# find the new table
pgswl> select pg_relation_filepath('foo')
pg_relation_filepath
----------------------
 base/16384/16388
(1 row)

```


If your not doing vacuums once in a while...
- we're slowingdown our queries...IF were doing lots of updates...LOTS of new records...! and we read 1 page
  lots of the records on that page are old & irrelevant...

```
vacuum; # cleans the catalog,
vacuum full; # cleans pages, thus all the tombstone records...
```

IF you have a data model where your not doing lots of updates or deletes, not a big deal.
imagine for tables with 30 fields!

tryo to think about modeling data where your doing lots of inserts instead.