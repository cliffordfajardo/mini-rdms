import { primitive } from '../Schema';
import { PlanNode } from 'types/PlanNode';
// import { SelectionArgs } from 'types/SelectionNode';

export type operator = '=' | '<' | '>' | '>=' | '<=' | 'ISNULL' | 'ISNOTNULL';

/**
 * Selection is the node which runs a predicate on a record.
 * 
 * @example
 * SELECT * FROM table WHERE id = 1
 *                     |_________|
 *                          |
 *                    SelectionNode
 */
export class SelectionNode implements PlanNode {
  constructor(
    private childPlanNode: PlanNode,
    private operator: operator,
    private column: string,
    private targetValue: primitive
  ) {}


  /**
   * Yield only records which return true for a predicate function
   */
  next(): any | null {
    const currentRow = this.childPlanNode.next();
    if (currentRow === null) return null; // we've run out of rows
    
    const currentRecordFieldValue = currentRow[this.column];
    if (this.operator === '=') return currentRecordFieldValue === this.targetValue ? currentRow : this.next();
    if (this.operator === '<') return currentRecordFieldValue < this.targetValue ?  currentRow : this.next();
    if (this.operator === '>') return currentRecordFieldValue > this.targetValue ? currentRow : this.next();
    if (this.operator === '>=') return currentRecordFieldValue >= this.targetValue ? currentRow : this.next();
    if (this.operator === '<=') return currentRecordFieldValue <= this.targetValue ?  currentRow: this.next();
    if (this.operator === 'ISNULL') return currentRecordFieldValue === null ? currentRow : this.next();
    if (this.operator === 'ISNOTNULL') return currentRecordFieldValue !== null ? currentRow : this.next();
    throw new Error(`Selection node encountered unknown operator ${this.operator}`);
  }
}
