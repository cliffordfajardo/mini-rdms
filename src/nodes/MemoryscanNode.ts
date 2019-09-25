import { PlanNode } from 'types/PlanNode';
import { InMemoryDB } from 'types/database-in-memory';


/**
 * A plan node that scans over records in memory.
 * This is intended to behave equivalently to FileScan, but over a list of input records rather than reading from disk.
 * 
 * @example 
 * SELECT * FROM some_table
 *                   |
 *                FileScanNode
 */
export class MemoryscanNode implements PlanNode {
  private readIndex = 0;
  constructor(
    private dataSource: InMemoryDB, 
    private tableName: string) {}

  /**
   * Fetches the next database record from `dataSource`
   */
  next(): any | null {
    const dbRecord = this.dataSource[this.tableName][this.readIndex++];
    if (dbRecord) {
      return dbRecord
    }
    return null;
  }

  /**
   * 
   */
  reset(){
    this.readIndex = 0;
  }
}
