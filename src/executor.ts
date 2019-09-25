import { MemoryscanNode } from './nodes/MemoryscanNode'
import { NestedLoopJoinNode } from './nodes/NestedLoopJoinNode';
import { ProjectionNode } from './nodes/ProjectionNode';
import { SortNode, sortDirection } from './nodes/SortNode';
import { SelectionNode, operator } from './nodes/SelectionNode';
import { DistinctNode } from './nodes/DistinctNode';
import { DatabaseInMemory } from "./database-inmemory";
import { PlanNode } from 'types/PlanNode';
import { primitive } from './Schema'


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

  'NESTEDJOIN': (leftColumn: string, rightColumn: string, leftChild: PlanNode, rightChild: PlanNode) => {
    return new NestedLoopJoinNode(leftColumn, rightColumn, leftChild, rightChild);
  }
}


type nodeType = 'SELECTION' | 'DISTINCT' | 'SORT' | 'PROJECTION' | 'FILESCAN';


export class Executor {
  public rootNode: PlanNode;
  private empty = false; //TODO rename to a better boolean variable 'is____'



  constructor(queryPlan: any[]) {
    this.rootNode = this.instantiateNode(queryPlan);
  }





  /**
   * Returns back record(s) by calling all PlanNodes down the tree.
   */
  next(): any {
    if (this.empty) return null; //TODO rename this to a more descriptive variavle
    
    // thiss will call every node down and eventually return the result
    const result = this.rootNode.next();
    if (result) return result
    
    this.empty = true;
    return null;
  }


  /**
   * Given a query plan, it will look at the items in the queryPlan
   * and instantiate the appropriate Node for that plan.
   *
   * @param queryPlan 
   * @example
   * const queryPlan = [
   *   'NestedJoin', 'movieId', 'movieId',
   *   ['Filescan', 'movies'],
   *   ['Filescan', 'ratings']
   * ]
   * instantiateNode(queryPlan) ⬇⬇⬇;
   * NestedLoopJoinNode {leftColumn:"movieId", rightColumn:"movieId", leftChild: MemoryscanNode, rightChild: MemoryscanNode}
   */
  private instantiateNode(queryPlan: any[]){
    const nodeType: nodeType = queryPlan[0];
    if(!nodeMap.hasOwnProperty(nodeType)) throw new Error(`Unknown node type ${nodeType}`);

    if(nodeType === 'FILESCAN' /* this node type is childlness */) {
      const tablename = queryPlan[1]
      return nodeMap['FILESCAN'](tablename);
    } 

    // else recursively parse the remaining arguments
    const fixedNodeArgs: any = queryPlan
      .slice(1)
      .map((nodeArg) => {
        //iterate over each element. If it's a string, then it's an argument so return it, 
        // otherwise it's a plan node and we need to instantiate it.
        if(this.isPlanNode(nodeArg)) {
          return this.instantiateNode(nodeArg)
        }
        return nodeArg;
    });
    
    
    // @ts-ignore
    return nodeMap[nodeType].apply(null, fixedNodeArgs); // then return the top-level one 
}

  private isPlanNode(arg: any){
    return Array.isArray(arg) && nodeMap.hasOwnProperty(arg[0]);
  }
}
