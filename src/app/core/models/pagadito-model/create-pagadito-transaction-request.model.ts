import { PagaditoTransactionDetailRequest } from "./pagadito-transaction-detail-request.model";

interface CustomDictionary {
  [key: string]: any;
}

export class CreatePagaditoTransactionRequest {
  amount: number;
  details: PagaditoTransactionDetailRequest[];
  custom: CustomDictionary;

  constructor() {
    this.amount = 0;
    this.details = [];
    this.custom = {};
  }
}
