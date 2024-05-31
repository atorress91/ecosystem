import {Component, OnDestroy, OnInit} from '@angular/core';
import {TicketMessageRequest} from '@app/core/models/ticket-model/ticket-message-request.model';
import {Ticket} from '@app/core/models/ticket-model/ticket.model';

import {UserAffiliate} from '@app/core/models/user-affiliate-model/user.affiliate.model';
import {AuthService} from '@app/core/service/authentication-service/auth.service';
import {TicketHubService} from '@app/core/service/ticket-service/ticket-hub.service';
import Swal from "sweetalert2";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.scss']
})
export class TicketViewComponent implements OnInit, OnDestroy {
  ticket: Ticket;
  config = {
    wheelSpeed: 0.5,
    swipeEasing: true,
    minScrollbarLength: 20,
    maxScrollbarLength: 50,
  };
  user: UserAffiliate;
  newMessage: string;
  ticketMessage: TicketMessageRequest = new TicketMessageRequest();
  messages: any = [];

  constructor(
    private authService: AuthService,
    private ticketHubService: TicketHubService) {
  }

  ngOnInit(): void {
    this.user = this.authService.currentUserAffiliateValue;
    this.getTicket();
  }

  ngOnDestroy(): void {
    this.ticketHubService.leaveRoom(this.ticket.id);
    this.ticketHubService.messageReceived.unsubscribe();
  }

  startConnection(ticketId: number) {
    this.ticketHubService.startConnection().then(
      () => this.ticketHubService.joinRoom(ticketId),
      error => console.error('Error al conectar o unirse a la sala:', error)
    );
  }

  getTicket(): void {
    this.ticketHubService.getTicket().subscribe({
      next: (ticketId: number) => {
        this.ticket.id = ticketId;
        this.startConnection(ticketId);
        this.receivedMessage();
      },
      error: (err) => {
        console.error('Error recibiendo ticket:', err);
      },
    });
  }

  showTicketDetails() {
    Swal.fire({
      title: 'Detalles del Ticket',
      text: this.ticket.description,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    }).then();
  }

  receivedMessage(): Subscription {
    return this.ticketHubService.messageReceived.subscribe({
      next: (message) => {
        const isMyMessage = message.user === this.user.id;
        const formattedMessage = {
          ...message,
          sentByMe: isMyMessage
        };

        if (!this.messages.some(m => m.id === message.user)) {
          this.messages.push(formattedMessage);
        }
      },
      error: (err) => {
        console.error('error recibiendo mensajes: ' + err);
      },
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
}
