export interface PlanNode {
  /**
   * All nodes require an interface to return the next record, so that its
   * parent can pull them as needed.
   */
  next(): any | null;



  /**
   * To support joins, all nodes must have an interface to reset their state. This includes join
   * nodes themselves, since they can be the inputs to other joins.
   * 
   * WHEN DO WE RESET?
   * This is done when we've finished iterating over all records on inside the inner loop of the "nested for loop".
   * 
   * Besides resetting the state of all nodes, think about the importance of resetting with this example:
   * After we've reached the end of our table, we call `reset`, which will reset the the state of all nodes down
   * the chain (since the all have reset methods), eventually reaching and setting Filescans offset/index to 0.
   * After that, we call `next` on the  letf table (AKA updating its index/offset up by1), we can rescan
   * the entire right table for the current index/offset of the left table. (THINK NESTED FOR LOOPS)
   * 
   * TODO: 
   * explain when `reset` will be called on NestedLoopJoin...that means an upper layer would call it.
   * maybe another nested loop?
   * 
   * @example
   * const movies_table = [{ mid:"0", title: "A"}, {mid:"1", title: "B"}]
   * const ratings_table = [{mid:"0", rating: 3},  {mid:"1", rating: 4}, {mid:"0", rating: 5}]
   * 
   * 
   */
  reset: () => void;
}