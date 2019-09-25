import { PlanNode } from 'types/PlanNode';



/**
 * 
 * @example
 * SELECT * FROM table1
 * JOIN table2 ON table1.col = table2.col
 */
export class NestedLoopJoinNode {
  private currentLeftTableRecord: any;       // TODO: what is the definite type of this?
  
  constructor(
    private leftColumnName: string,   // leftColumnName
    private rightColumnName: string,  // rightColumnName
    private leftChild: PlanNode,  
    private rightChild: PlanNode
  ) {}
  
  /**
   * TODO: add better variable names for IFs
   * WHERE IS the nested loop?
   */
  next(): any | null { // why does currentLeftTableRecord need to exist as a field & not just a variable
    this.currentLeftTableRecord = this.currentLeftTableRecord || this.leftChild.next(); // This || is helpful because after the first record we fetch, we already have a record and we can grab the field value from it instead of fetching...calling 'next' will keep 'calling' next until we reach something like a Filescan Node.
    let leftTableJoinFieldValue = this.currentLeftTableRecord[this.leftColumnName];

    while (true) {
      let rightTableRecord = this.rightChild.next();                        //TODO: could this have an interface:  {[propName: string]: primitive}
      
      if (rightTableRecord) {
        let rightTableJoinFieldValue = rightTableRecord[this.rightColumnName];
        if (leftTableJoinFieldValue === rightTableJoinFieldValue) {
          return this.joinRecords(this.currentLeftTableRecord, rightTableRecord);
        }
      } 
      
      else {
                                                              // we've finished iterating the entire right table for the current iteration of the left record (think about nested loops!)
        this.currentLeftTableRecord = this.leftChild.next();  // move the current left table 'index' up, by fetching the next record, and start looping the entire right child again for this current iteration of `leftChild`
        if(this.currentLeftTableRecord) {
          leftTableJoinFieldValue = this.currentLeftTableRecord[this.leftColumnName]; // get the join field column value again

          
          this.rightChild.reset();                            // reset index of the right child so we can scan the table for the current iteration of `leftChild`
          rightTableRecord = this.rightChild.next();
        } else {
          return null
        } 
      }
    }
  }

  /**
   *
   */
  reset() {
    this.leftChild.reset();
    this.rightChild.reset();
    this.currentLeftTableRecord = null;
  }

  /**
   * Joins records from B into A
   * @param a
   * @param b
   * @example
   * const a = {name:'Ada'}, b = {course: 'Anatomy'}
   * joinRecords(a,b) --> {name: 'Ada', course: 'Anatomy'}
   */
  private joinRecords(a: any, b: any) {
    const merged = {...a, ...b};
    return merged;
  }
}
