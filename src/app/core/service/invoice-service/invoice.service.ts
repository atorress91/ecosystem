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
    // Ajustamos los httpOptions para esperar un 'blob' como respuesta
    const options = {
      responseType: 'blob' as 'json', // Esto es necesario debido a la forma en que TypeScript maneja los generics y los tipos de respuesta
      params: new HttpParams().set('invoiceId', invoiceId.toString()), // Pasamos 'invoiceId' como parámetro de consulta
      headers: new HttpHeaders({
        'Authorization': environment.tokens.walletService.toString()
        // Aquí no establecemos 'Content-Type': 'application/json' porque no estamos enviando un cuerpo JSON
      })
    };

    // Usamos los 'options' ajustados en la llamada HTTP
    return this.http.get<Blob>(`${this.urlApi}/invoice/CreateInvoice`, options);
  }

}
