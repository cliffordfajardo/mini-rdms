import { PlanNode } from 'types/PlanNode';

export type primitiveType = 'string' | 'number' | 'boolean';
export type sortDirection = 'ASC' | 'DESC';

type PredicateFunction = (x: any, y: any) => any;
type LoadablePredicate = (columnName: string) => PredicateFunction;
type SortPredicateSet = {
  [type in sortDirection]: LoadablePredicate;
};

type PredicateExpressionSet = {
  [type in primitiveType]: SortPredicateSet;
};




const predicateExpressionsMap = {
  number: {
    ASC: function(columnName: string) {
      return function sortNumberASCPredicate(a:any, b:any) {
        return a[columnName] - b[columnName]
      }
    },
    DESC: function(columnName: string){
      return function sortNumberDESCPredicate(a: any, b: any) {
        return b[columnName] - a[columnName]
      }
    }
  },

  string: {
    ASC: function (columnName: string) {
      return function sortStringASCPredicate(a: any, b: any) {
        return a[columnName] < b[columnName] ? -1 : a[columnName] === b[columnName] ? 0 : 1;
      }
    }, 
    DESC: function(columnName: string){
      return function sortStringDescPredicate(a:any, b: any) {
        return a[columnName] < b[columnName] ? 1 : a[columnName] === b[columnName] ? 0 : -1;
      }
    }
  },

  boolean: {
    ASC: function(columnName: string) {
      return function sortBooleanASCPredicate(a:any, b:any) {
        return a[columnName] < b[columnName] ? -1 : a[columnName] === b[columnName] ? 0 : 1;
      } 
    },
    DESC: function(columnName: string) {
      return function(a:any, b:any) {
        return a[columnName] < b[columnName] ? 1 : a[columnName] === b[columnName] ? 0 : -1;
      }
    }
  },
} as PredicateExpressionSet;




export class SortNode implements PlanNode {
  private storage: any[] = [];
  private recordsListIsFull = false;
  private yieldedRowCount = 0;

  constructor(
    private childPlanNode: PlanNode,
    private columnName: string,
    private sortDirection: sortDirection
  ) {}


  /**
   * The first time we `next` we gather all the records we can in memory.
   * 
   * Once we're filled and sorted and we call `next` each time, we will yield
   * back one record from out sorted list.
   */
  next(): any | null {
    
    if (!this.recordsListIsFull) {
      let tmp;
      // keep fetching records & pushing them, until there is no more.
      while (tmp = this.childPlanNode.next()) {
        this.storage.push(tmp);
      }
      
      this.recordsListIsFull = true; 

      if (!this.storage.length) return null; // bail out if we were given an empty set


      // validate sorting is possible
      const columnDataType = typeof this.storage[0][this.columnName];
      if (!columnDataType) throw new Error(`Column ${this.columnName} does not exist`);
      if (!predicateExpressionsMap.hasOwnProperty(columnDataType)) throw new Error(`Unknown type ${columnDataType} in column ${this.columnName}`);



      
      // tease out the correct predicate
      // @ts-ignore
      const predicateSet = predicateExpressionsMap[columnDataType] as SortPredicateSet;
      const loadablePredicate = predicateSet[this.sortDirection] as LoadablePredicate;
      const predicate = loadablePredicate(this.columnName);


      this.storage.sort(predicate);
    } 
    
    else {
      // called on the 2nd & subsequent calls to `next` we begin returning back the sorted records.
      const record = this.storage[this.yieldedRowCount++];
      if(record) return record;
      return null;
    }
  }

  /**
   * 
   */
  reset(){
    this.childPlanNode.reset();
    this.yieldedRowCount = 0;
    this.recordsListIsFull = false;
    this.storage = [];
  }
}
