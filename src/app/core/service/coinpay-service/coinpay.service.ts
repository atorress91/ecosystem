import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { map } from 'rxjs';

import { Response } from '@app/core/models/response-model/response.model';
import { RequestPayment } from '@app/core/models/coinpay-model/request-payment.model';

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

  createChannel(request: RequestPayment) {
    return this.http
      .post<Response>(this.urlApi.concat('/coinpay/createChannel'), request, httpOptions)
      .pipe(
        map((response) => {
          console.log('response', response);
          return response;
        }));
  }
}
