import { PlanNode } from 'types/PlanNode';
import * as fs from 'fs';
import parse from 'csv-parse/lib/sync';



/**
 * Node is in charge of accessing data from disk.
 */
export class FilescanNode implements PlanNode {
  private currentBlockIndex = 0;
  private headerParsed = false;
  private header: string = '';
  private file: string;
  private parsedDataBuffer: any[] = []; // parsed rows from disk saved here
  private readIndex = 0;

  constructor(dataDir: string, source: string) {
    this.file = fs.readFileSync(`${dataDir}/${source}.csv`).toString('utf8');
    this.loadNextBlock();
  }


  /**
   * Fetches the next database record.
   */
  next(): any | null {
    // if there isn't a current block or we're at the end of the current block
    if (this.readIndex === this.parsedDataBuffer.length) return null; // this.loadNextBlock(); // try loading a new current block
    // if there *still* is no current block
    if (!this.parsedDataBuffer.length) return null; // return null. We're at the end
    // we definitely have a current block and are not at the end of it
    return this.parsedDataBuffer[this.readIndex++];
  }


  /**
   * 
   */
  reset() {
    this.currentBlockIndex = 0;
    this.headerParsed = false;
    this.header = '';
    this.parsedDataBuffer = [];
    this.readIndex = 0;
    this.loadNextBlock();
  }


  /**
   * 1.Parses csv file content into an array of object representing tuples
   * 2.Array of tuples is saved to `parsedDataBuffer`
   */
  parseBlockToCSV() {
    const newTupleBuffer = parse(this.file, { columns: true, auto_parse: true});
    this.parsedDataBuffer = newTupleBuffer;
  }

  /**
   * Reads CSV file from disk, it gets parsed to an array of tuple objects, and saves all tuples into `this.parsedDataBuffer`.
   */
  loadNextBlock(): void {
    this.parseBlockToCSV();
  }
}
