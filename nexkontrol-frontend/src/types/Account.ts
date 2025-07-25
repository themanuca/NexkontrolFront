export interface Account{
  id:string;
  name:string;
  InitialBalance:number;
  userId:string;
  type:AccountType
}
export enum AccountType{
  Bank = 0,
  CreditCard = 1,
  Cash = 2,
  DigitalWallet = 3
}
