

export type operator = '=' | '<' | '>' | '>=' | '<=' | 'ISNULL' | 'ISNOTNULL';
export type primitive = number | string | boolean;

// interface SelectionArgs {
//   childPlanNode: INode,
//   operator: operator,
//   column: string,
//   constant: primitive
// }