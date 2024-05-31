import {Component, OnInit} from '@angular/core';
import {TicketMessageRequest} from "@app/core/models/ticket-model/ticket-message-request.model";
import {Ticket} from "@app/core/models/ticket-model/ticket.model";
import Swal from "sweetalert2";
import {TicketHubService} from "@app/core/service/ticket-service/ticket-hub.service";
import {AuthService} from "@app/core/service/authentication-service/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-tick-view',
  templateUrl: './ticket-view-admin.component.html',
  styleUrls: ['./ticket-view-admin.component.sass']
})
export class TicketViewAdminComponent implements OnInit {
  user: any;
  ticket: Ticket;
  config = {
    wheelSpeed: 0.5,
    swipeEasing: true,
    minScrollbarLength: 20,
    maxScrollbarLength: 50,
  };
  newMessage: string;
  ticketMessage: TicketMessageRequest = new TicketMessageRequest();
  messages: any = [];

  constructor(private ticketHubService: TicketHubService, private authService: AuthService) {

  }

  ngOnInit() {
    this.user = this.authService.currentUserAdminValue;
    console.log(this.user);
    this.ticketHubService.getTicket().subscribe(ticketId => {
      this.startConnection(ticketId);
    });
  }

  startConnection(ticketId: number) {
    this.ticketHubService.startConnection().then(() => {
        this.ticketHubService.joinRoom(ticketId).then();
        this.getTicketById(ticketId);
        this.receivedMessage();
      },
      error => console.error('Error al conectar o unirse a la sala:', error)
    );
  }

  showTicketDetails() {
    Swal.fire({
      title: 'Detalles del Ticket',
      text: this.ticket.description,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    }).then();
  }

  getTicketById(ticketId: number) {
    this.ticketHubService.getTicketById(ticketId);
    this.ticketHubService.ticketCreated.subscribe({
      next: (ticket: Ticket | null) => {
        if (ticket) {
          this.ticket = ticket;
          ticket.messages.forEach(message => this.processMessageSender(message));
        } else {
          console.log('No ticket received or connection not established');
        }
      },
      error: (err) => {
        console.error('Error recibiendo ticket:', err);
      }
    });
  }

  receivedMessage(): Subscription {
    return this.ticketHubService.messageReceived.subscribe({
      next: (message) => {
        this.processMessageSender(message);
      },
      error: (err) => console.error('Error recibiendo mensajes:', err),
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.ticketMessage.ticketId = this.ticket.id;
      this.ticketMessage.userId = this.user.id;
      this.ticketMessage.messageContent = this.newMessage;

      const myMessage = {
        user: this.user.id,
        content: this.newMessage,
        sentByMe: true
      };

      this.ticketHubService.sendMessage(this.ticketMessage);
      this.newMessage = '';
    }
  }

  processMessageSender(message: any) {
    console.log('Procesando mensaje', message);
    const isMyMessage = message.userId === this.user.id;
    const formattedMessage = {
      ...message,
      sentByMe: isMyMessage
    };

    if (!this.messages.some(m => m.id === message.id)) {
      this.messages.push(formattedMessage);
    }
  }
}
