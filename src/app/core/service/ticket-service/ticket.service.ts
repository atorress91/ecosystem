import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Response } from '@app/core/models/response-model/response.model';
import { Ticket } from '@app/core/models/ticket-model/ticket.model';
import { map } from 'rxjs';

const httpOptions = {

  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': environment.tokens.accountService.toString() }),
};

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  urlApi: string;

  constructor(private http: HttpClient) {
    this.urlApi = environment.apis.accountService;
  }

  createTicket(ticket: Ticket) {
    return this.http
      .post<Response>(
        this.urlApi.concat('/ticket'),
        ticket,
        httpOptions
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
