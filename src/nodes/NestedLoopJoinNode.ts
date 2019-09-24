import { INode } from '../executor';
import { PlanNode } from 'types/Nodes';

export class NestedLoopsJoin {
    constructor(
        private left_table_join_col: PlanNode,
        private right_table_join_col: PlanNode,
        private left_table: string,
        private right_table: string,
    ){}

    reset(){
      
    }
    

    next(): any | null {
    }
}
