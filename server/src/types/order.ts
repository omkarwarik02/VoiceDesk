export type OrderChanges = {
    dueDate?:string;
    amount?:number;
    advancePaid?:number;
    isUrgent?:boolean
    notes?:string;
    customerPhone?:string;
    items?:{name:string; quantity:number; unit?:string}[];
}