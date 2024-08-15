import { ModelBalancesInvoices } from './../../models/invoice-model/model-balances-invoices';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Response } from '@app/core/models/response-model/response.model';
import { environment } from '@environments/environment';
import { Invoice } from '@app/core/models/invoice-model/invoice.model';
import { Observable } from 'rxjs';

const httpOptions = {

  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': environment.tokens.walletService.toString(),
    'X-Client-ID': environment.tokens.clientID.toString()
  }),
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

  sendInvitationsForUpcomingCourses(link: string, code: string) {
    let params = new HttpParams()
      .set('link', link)
      .set('code', code);

    const urlWithParams = `${this.urlApi}/invoice/SendInvitationsForUpcomingCourses?${params.toString()}`;
    return this.http
      .post<Response>(urlWithParams, {}, httpOptions)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  getAllInvoicesForModelOneAndTwo() {
    return this.http
      .get<Response>(this.urlApi.concat('/invoice/GetAllInvoicesForModelOneAndTwo'), httpOptions)
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }

  processAndReturnBalancesForModels1A1B2(request: ModelBalancesInvoices) {
    return this.http
      .post<Response>(this.urlApi.concat('/invoice/ProcessAndReturnBalancesForModels1A1B2'), request, httpOptions)
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }

  createInvoice(invoiceId: number): Observable<Blob> {
    const options = {
      responseType: 'blob' as 'json',
      params: new HttpParams().set('invoiceId', invoiceId.toString()),
      headers: new HttpHeaders({
        'Authorization': environment.tokens.walletService.toString()

      })
    };

    return this.http.get<Blob>(`${this.urlApi}/invoice/create_invoice`, options);
  }

  createInvoiceByReference(reference: string): Observable<Blob> {
    const options = {
      responseType: 'blob' as 'json',
      params: new HttpParams().set('reference', reference.toString()),
      headers: new HttpHeaders({
        'Authorization': environment.tokens.walletService.toString()

      })
    };

    return this.http.get<Blob>(`${this.urlApi}/invoice/create_invoice_by_reference`, options);
  }
}
