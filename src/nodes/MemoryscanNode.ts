import { PlanNode } from 'types/PlanNode';
import { InMemoryDB } from 'types/database-in-memory';


/**
 * FilescanNode is in charge of accessing data from a table/file.
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
}
