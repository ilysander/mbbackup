export interface AccountResponse {
  _exchangeToken: string;
  product: Product;
  currency: Currency;
}

interface Product {
  [id: string]: string;
  description: string;
}

interface Currency {
  [id: string]: string;
  description: string;
  symbol: string;
}

export interface AccountSendResponse {
  Account: Account;
  Client: Client;
  Operation: Operation;
  currency: Currency;
  product: Product;
}

interface Operation {
  number: string;
  date: string;
}
interface Product {
  id: string;
  description: string;
}

interface Currency {
  id: string;
  description: string;
  symbol: string;
}
interface Client {
  id: string;
  _name: string;
}

interface Account {
  number: string;
  openingdate: string;
  openingtime: string;
}
