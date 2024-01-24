import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  ticketId: number;
  user: UserAffiliate;
  newMessage: string;
  ticket: Ticket = new Ticket();
  ticketMessage: TicketMessageRequest = new TicketMessageRequest();
  messages: any = [];

  constructor(private route: ActivatedRoute, private authService: AuthService, private ticketHubService: TicketHubService, private ticketService: TicketService) {
    this.route.params.subscribe((params) => { this.ticketId = params.id; });
    console.log(this.ticketId);
  }

  ngOnInit(): void {
    this.ticketId = +this.route.snapshot.paramMap.get('id');
    this.user = this.authService.currentUserAffiliateValue;
    this.ticketHubService.startConnection().then(() => {
      this.ticketHubService.joinRoom(this.ticketId);
    });

    this.ticketHubService.messageReceived.subscribe((message) => {
      this.messages.push(message);
    });

    this.ticketHubService.previousMessagesReceived.subscribe((previousMessages) => {
      console.log(previousMessages);
      this.messages = [...previousMessages, ...this.messages];
    });

  }

  ngOnDestroy(): void {
    this.ticketHubService.leaveRoom(this.ticketId);
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.ticketMessage.ticketId = this.ticketId;
      this.ticketMessage.userId = this.user.id;
      this.ticketMessage.messageContent = this.newMessage;

      this.ticketHubService.sendMessage(this.ticketMessage);
      this.messages.push({ user: this.user.name, content: this.newMessage });
      this.newMessage = '';
    }
  }
}
