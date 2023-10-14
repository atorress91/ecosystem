import { RequestPayment } from './../../models/coinpay-model/request-payment.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': environment.tokens.walletService.toString() }),
};

@Injectable({
  providedIn: 'root'
})
export class CoinpayService {
  private urlApi: string;

  constructor(private router: Router, private http: HttpClient) {
    this.urlApi = environment.apis.walletService;
  }

  createCoinPayTransaction(requestPayment: RequestPayment) {
    return this.http
      .post(this.urlApi.concat('/coinpay/createTransaction'), requestPayment, httpOptions);
  }
}
