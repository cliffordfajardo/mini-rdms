import { PlanNode } from 'types/PlanNode';

/**
 * ProjectNode is in charge returning records with only the fields specified.
 * 
 * @example 
 * SELECT name, id FROM some_table
 *       |_______|
 *           |
 *      ProjectionNode
 */
export class ProjectionNode implements PlanNode {
  constructor(private childPlanNode: PlanNode, 
              private columnList: string[]) {}

  /**
   * Fetches the next database record & returns the new projection of the record.
   */
  next(): any | null {
    const nextRow = this.childPlanNode.next();
      if (nextRow) {
        return this.formatRecord(nextRow);
      }
      return nextRow
  }


  /**
   * TODO
   */
  reset() {
    this.childPlanNode.reset();
  }

  /**
   * Given a database record, it will reduce it down to contain only fields specified
   * in the 'columnList
   * 
   *@example 
    IF columnList=['title']
    formatRecord({movieId:0, title:'Apples'}) === {title: 'Apples'}
   */
  formatRecord(databaseRecord:any) {
    const result = this.columnList.reduce((result: any, key) => {
      result[key] = databaseRecord[key];
      return result;
    }, {});
    return result;
  }
}
