import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Response } from '@app/core/models/response-model/response.model';
import { environment } from '@environments/environment';
import { Invoice } from '@app/core/models/invoice-model/invoice.model';
import { Observable, throwError } from 'rxjs';

const httpOptions = {

  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': environment.tokens.walletService.toString() }),
};

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private urlApi: string;

  constructor(private router: Router, private http: HttpClient) {
    this.urlApi = environment.apis.walletService;
  }

  getAllInvoicesUser(id: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(
      this.urlApi.concat(
        '/invoice/GetAllInvoicesByUserId?id=',
        id.toString()
      ),
      httpOptions
    ).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response;
        } else {
          console.error('ERROR: ' + response);
          return null;
        }
      }),
    );
  }

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(
      this.urlApi.concat(
        '/invoice/GetAllInvoices'),
      httpOptions
    ).pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response;
        } else {
          console.error('ERROR: ' + response);
          return null;
        }
      }),
    );
  }

  getAllInvoicesForTradingAcademyPurchases() {
    return this.http
      .get<Response>(this.urlApi.concat('/invoice/GetAllInvoicesForTradingAcademyPurchases'), httpOptions)
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }
}
