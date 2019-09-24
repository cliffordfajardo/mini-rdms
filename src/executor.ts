import { MemoryscanNode } from './nodes/MemoryscanNode'
import { ProjectionNode } from './nodes/ProjectionNode';
import { SortNode, sortDirection } from './nodes/SortNode';
import { SelectionNode, operator } from './nodes/SelectionNode';
import { DistinctNode } from './nodes/DistinctNode';
import { primitive } from './Schema'
import { PlanNode } from 'types/PlanNode';
import { DatabaseInMemory } from "./database-inmemory";

// const dataDir ='/Users/cliffordfajardo/Documents/code/bradfield-cs/databases/baby-sql/data';

/**
 * Used as a mechanism for selecting a Node.
 */
const nodeMap = {
  'SELECTION': (child: PlanNode, o: operator, column: string, constant: primitive) => {
    return new SelectionNode(child, o, column, constant);
  },
  
  'DISTINCT': (child: PlanNode, column: string) => {
    return new DistinctNode(child, column);
  },
  
  'SORT': (child: PlanNode, column: string, direction: sortDirection) => {
    return new SortNode(child, column, direction);
  },
  
  'PROJECTION': (child: PlanNode, columnList: string[]) => {
    return new ProjectionNode(child, columnList);
  },
  
  'FILESCAN': (tableName: string) => {
    return new MemoryscanNode(DatabaseInMemory, tableName);
  },
}

type nodeType = 'SELECTION' | 'DISTINCT' | 'SORT' | 'PROJECTION' | 'FILESCAN';


export class Executor {
  public rootNode: PlanNode;
  private empty = false;

  constructor(queryPlan: any[]) {
    const nodeType = queryPlan[queryPlan.length-1][0] as nodeType;

    if (nodeType !== 'FILESCAN') throw new Error(`Leaf node of query must be a FILESCAN. Got ${nodeType}`);
    const tableName = queryPlan[queryPlan.length-1][1];

    let childNode: PlanNode = nodeMap['FILESCAN'](tableName);
    let currentNode: PlanNode;

    // Start Looping from the element above 'FILESCAN'
    for (let i = queryPlan.length - 2; i >= 0; i--) {
      const nodeType = queryPlan[i][0] as nodeType;
      const nodeArgs = queryPlan[i].slice(1);
      if (!nodeMap[nodeType]) throw new Error(`Unknown node type ${nodeType}`);

      
      const args = [childNode].concat(nodeArgs);
      // @ts-ignore
      currentNode = nodeMap[nodeType].apply(null, args); 
      childNode = currentNode;
    }

    this.rootNode = childNode;
  }

  /**
   * Returns back record(s) by calling all PlanNodes down the tree.
   */
  next(): any {
    if (this.empty) return null;
    
    const result = this.rootNode.next();
    if (!result) return result
    
    this.empty = true;
    return null;
  }
}
