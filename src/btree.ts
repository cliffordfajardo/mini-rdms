

/**
 * 
 * 
 * Balancing the tree is something we have to do with (almost?) every insert, but the worst case scenario is O(logn)
 */
export class BPlusTree {
  public root:any;
  public children =[];
  /**
   * 
   * @param {Number} degree - This is also known as the order of the b
   */
  constructor(degree: number){
   if(degree < 3 ) throw new Error(`Please provide an integer over ${degree}.`);
  }


  /**
   * 
   * Time complexity: O(logn)
   */
  insert(){}



  /**
   * 
   * Time complexity: O(logn)
   */
  delete(){}
}