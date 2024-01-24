import { TicketMessageRequest } from './../../models/ticket-model/ticket-message-request.model';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketHubService {
  private hubConnection: signalR.HubConnection;
  public messageReceived = new Subject<{ user: string, content: string }>();
  public previousMessagesReceived = new Subject<Array<{ user: string, content: string }>>();
  connectionError: any;

  public async startConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5200/ticketHub')
      .build();

    try {
      await this.hubConnection.start();
      this.addMessageListener();
    } catch (error) {
      console.error(`Error al iniciar la conexión: ${error}`);
      this.connectionError.next(`Error al iniciar la conexión: ${error}`);
      throw error;
    }
  }

  private addMessageListener(): void {
    this.hubConnection.on('ReceiveMessage', (user, content) => {
        this.messageReceived.next({ user, content });
    });

    this.hubConnection.on('ReceivePreviousMessages', (messages) => {
        this.previousMessagesReceived.next(messages);
    });
}

  public joinRoom(ticketId: number): void {
    this.hubConnection.invoke('JoinTicketRoom', ticketId)
      .catch(error => {
        console.error(`Error al unirse a la sala: ${error}`);
        this.connectionError.next(`Error al unirse a la sala: ${error}`);
      });
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
}
