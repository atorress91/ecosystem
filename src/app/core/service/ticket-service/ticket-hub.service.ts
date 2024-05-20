import {Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {HubConnectionState} from "@microsoft/signalr";

import {TicketRequest} from '@app/core/models/ticket-model/ticketRequest.model';
import {TicketMessageRequest} from '@app/core/models/ticket-model/ticket-message-request.model';
import {Ticket} from '@app/core/models/ticket-model/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketHubService {
  private hubConnection: signalR.HubConnection;
  public messageReceived = new Subject<{ user: string, content: string }>();
  connectionError: any;
  public ticketCreated = new BehaviorSubject<Ticket | null>(null);
  public ticketsReceived = new Subject<Ticket[]>();
  public connectionEstablished = new BehaviorSubject<boolean>(false);

  constructor() {
    const savedTicket = localStorage.getItem('ticket');
    this.ticketCreated = new BehaviorSubject<Ticket | null>(savedTicket ? JSON.parse(savedTicket) : null);
  }

  public setTicket(ticket: Ticket) {
    this.ticketCreated.next(ticket);
    localStorage.setItem('ticket', JSON.stringify(ticket));
  }

  public getTicket(): Observable<Ticket | null> {
    return this.ticketCreated.asObservable();
  }

  public async startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5200/ticketHub')
      .withAutomaticReconnect()
      .build();

    try {
      await this.hubConnection.start();
      this.addMessageListener();
      this.connectionEstablished.next(true);
    } catch (error) {
      console.error(`Error al iniciar la conexión: ${error}`);
      this.connectionEstablished.next(false);
      this.connectionError.next(`Error al iniciar la conexión: ${error}`);
      throw error;
    }
  }

  private addMessageListener(): void {
    this.hubConnection.on('ReceiveMessage', (user, content) => {
      this.messageReceived.next({user, content});
    });

    this.hubConnection.on('TicketCreated', (ticket: Ticket) => {
      this.ticketCreated.next(ticket);
    });

    this.hubConnection.on('ReceiveTickets', (tickets: Ticket[]) => {
      this.ticketsReceived.next(tickets);
    });

    this.hubConnection.on('ReceiveTicketsForAdmin', (tickets: Ticket[]) => {
      this.ticketsReceived.next(tickets);
    });
  }

  public async joinRoom(ticketId: number): Promise<boolean> {
    try {
      await this.hubConnection.invoke('JoinTicketRoom', ticketId);
      console.log(`Unido exitosamente a la sala con ticketId: ${ticketId}`);

      return true;
    } catch (error) {
      console.error(`Error al unirse a la sala: ${error}`);
      this.connectionError.next(`Error al unirse a la sala: ${error}`);

      return false;
    }
  }

  public leaveRoom(ticketId: number): void {
    this.hubConnection.invoke('LeaveTicketRoom', ticketId)
      .catch(error => console.error(`Error al salir de la sala: ${error}`));
  }

  public sendMessage(ticketMessage: TicketMessageRequest): void {
    this.hubConnection.invoke('SendMessageToTicket', ticketMessage)
      .catch(error => console.error(`Error al enviar mensaje: ${error}`));
  }

  public stopConnection(): void {
    this.hubConnection.stop()
      .catch(error => console.error(`Error al detener la conexión: ${error}`));
  }

  public createTicket(ticketRequest: TicketRequest): Promise<void> {
    if (!this.hubConnection) {
      return Promise.reject("Hub connection is not established.");
    }

    return new Promise((resolve, reject) => {
      this.hubConnection.invoke('CreateTicket', ticketRequest)
        .then(response => resolve(response))
        .catch(error => {
          console.error(`Error al crear el ticket: ${error}`);
          reject(error);
        });
    });
  }

  public getAllTicketsByAffiliateId(affiliateId: number): Subject<Ticket[]> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.invoke('GetAllTicketsByAffiliateId', affiliateId)
        .catch(error => {
          console.error(`Error retrieving tickets: ${error}`);
        });
    } else {
      console.error('Cannot send data if the connection is not in the \'Connected\' State.');
    }
    return this.ticketsReceived;
  }

  public getAllTickets(): Subject<Ticket[]> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.invoke('GetAllTickets')
        .catch(error => {
          console.error(`Error retrieving tickets: ${error}`);
        });
    } else {
      console.error('Cannot send data if the connection is not in the \'Connected\' State.');
    }
    return this.ticketsReceived;
  }
}
