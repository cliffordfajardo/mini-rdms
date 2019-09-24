import { PlanNode } from 'types/PlanNode';


/**
 * @example
 * SELECT DISTINCT name FROM employees
 *        |________|
 *            |
 *        DistinctNode
 */
export class DistinctNode {
  private aPreviousRecordFieldValue: any = undefined;
  constructor(private childPlanNode: PlanNode,
              private column: string) {}


  /**
   * Drop records in the stream that are the same as the prior one
   */
  next(): any | null {
    const nextRow = this.childPlanNode.next();
    if(nextRow === null) return null; // we've run out of rows
    
    
    const currentRecordFieldValue = nextRow[this.column];
    if (currentRecordFieldValue === this.aPreviousRecordFieldValue) {
      // we're just going to skip adn fetch the next record.
      return this.next();
    }
    
    //this is the first time we're encountering so let's return it
    this.aPreviousRecordFieldValue = nextRow[this.column];
    return nextRow;
    
  }
}
