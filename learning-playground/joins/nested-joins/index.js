// CS186:     http://www.cs.ucr.edu/~tsotras/cs236/W15/join.pdf
// Resources: https://dataschool.com/how-to-teach-people-sql/sql-join-types-explained-visually/


const students_table = [
  {id: 0, name: 'Anna', gpa: 3},
  {id: 1, name: 'Beth', gpa: 3}
];
const enrollment_table = [
  {id: 0, student_id:0, course: 'Anatomy'},
  {id: 1, student_id:1, name: 'Biology'},
  {id: 1, student_id:0, name: 'Cooking'},
];

// How can we join both of these stables?
// Iterate through one table,
// for each row, 
//  look at the row on the other table using the 'column_name' that serves as the mapping key (student_id or id)
//   and create a new row from both

/**
 * Merge rows only if the mapping keys match and return the results
 * For every record in table1, we need to do a fill scan of S.  
 * 
 * @param {Array} table1 
 * @param {Array} table2 
 * @param {Array<string, string>} mappingKeys WHERE clause "table.mappingKey1 == table2.     mappingKey2"
 * 
 * Runtime cost? https://archive.org/details/ucberkeley_webcast_vNhxtDZ5-C4
 * 
 */
function innerJoin(table1, table2, mappingKeys) {
  const mergedResults = [];
  const [key1, key2] = mappingKeys;
  for (const tb1_row of table1) {
    for(const tb2_row of table2) {
      const foundMatch = table1[key1] === table2[key2];
      if(foundMatch) {
        const merged = {...tb1_row, ...tb2_row};
        mergedResults.push(merged);
      }
    }
  }
  return mergedResults;
}





// Does using the smaller table for the outer loop or inner matter affect performance?
// Yes, imagine this:
const enrollment_table = [
  {id: 0, student_id:0, course: 'Anatomy'},
  {id: 1, student_id:1, name: 'Biology'},
  {id: 1, student_id:0, name: 'Cooking'},
];
const students_table = [
  {id: 0, name: 'Anna', gpa: 3},
  {id: 1, name: 'Beth', gpa: 3}
];

// We would need to loop on the outside 3 times, instead of 2 as before
// On the third run, we would need to iterate the entire students table again

//❓❓ It's always wise to do the math calculation. Will the Query planner choose the lesser expensive operations, or does the way we order our join matter❓❓






// Read a page into memory from Table1, then scan Table2
// instead of reading individual rows of table1, we read a blocks, then scan it 1 block at a time on S
// were doing the old algorithm IN MEMORY, this is how we deal with not being to load everything in memeory.
// IMPROVEMENTS:
//  🛑 reminder, your here to build intuition not build your own production DBMS from scratch
//  - factor of 100 improvements covered in video.....
//  - Better to do read in of multiple blocks to memoery, since we can afford it VS 1 at a time
function pageOrientedNestedLoopJoin(){}











// Index Nested Loops Join
// TLDR: think of binary search to save us time....
/**
 * Same nested loop join stuff, except we add a new clause (a conditional check)
 * Instead of scanning table2 in the inner loop, we're instead going to do a look up & for every match
 * we'll do a nested loop, if not we don't do a nested loop.
 * 
 * @param {Array} table1 
 * @param {Array} table2 
 * @param {Array<string, string>} mappingKeys WHERE clause "table.mappingKey1 == table2.     mappingKey2"
 * 
 * We save time by look at the index
 */
function indexJoin(table1, table2, mappingKeys) {
  const mergedResults = [];
  const [key1, key2] = mappingKeys;

  for (const tb1_row of table1) {
    const foundIndexMatch = 'anIndex[mappingKey] ...this will return all the matching table2 records❓❓ Are we getting buckets of rows?';
    
    if(foundIndexMatch) {
      for(const tb2_row of table2) {
        const foundMatch = table1[key1] === table2[key2];
        if(foundMatch) {
          const merged = {...tb1_row, ...tb2_row};
          mergedResults.push(merged);
        }
      }
    }
    
  }
  return mergedResults;
}

















//44m sort covered 