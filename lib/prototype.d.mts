export function quote(items: {price:number}[]): {subtotal:number;discount:number;total:number};
export function available<T extends {id:number}>(items:T[], sold:number[]):T[];
