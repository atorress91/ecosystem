import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketMessageRequest } from '@app/core/models/ticket-model/ticket-message-request.model';
import { Ticket } from '@app/core/models/ticket-model/ticket.model';

import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { TicketHubService } from '@app/core/service/ticket-service/ticket-hub.service';
import { TicketService } from '@app/core/service/ticket-service/ticket.service';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.sass']
})
export class TicketViewComponent {
  ticket: any;
  user: UserAffiliate;
  newMessage: string;
  ticketMessage: TicketMessageRequest = new TicketMessageRequest();
  messages: any = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private ticketHubService: TicketHubService,
    private ticketService: TicketService,
    private router: Router) {

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
      next: (ticket: Ticket) => {
        this.ticket = ticket;
        console.log('Ticket recibido:', ticket);
        this.startConnection(ticket.id);
        this.receivedMessage();
      },
      error: (err) => {
        console.error('Error recibiendo ticket:', err);
      },
    });
  }

  receivedMessage(): void {
    this.ticketHubService.messageReceived.subscribe({
      next: (message) => this.messages.push(message),
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

      this.ticketHubService.sendMessage(this.ticketMessage);
      this.messages.push({ user: this.user.name, content: this.newMessage });
      this.newMessage = '';
    }
  }
}
