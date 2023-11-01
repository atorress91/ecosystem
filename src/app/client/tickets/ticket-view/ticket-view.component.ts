import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { TicketHubService } from '@app/core/service/ticket-service/ticket-hub.service';

@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.sass']
})
export class TicketViewComponent {
  ticketId: number;
  user: UserAffiliate;
  newMessage: string;
  messages: { sender: string, content: string, time: Date }[] = [];

  constructor(private route: ActivatedRoute, private authService: AuthService, private ticketHubService: TicketHubService) { }

  ngOnInit(): void {
    this.ticketId = +this.route.snapshot.paramMap.get('id');
    this.user = this.authService.currentUserAffiliateValue;
    this.ticketHubService.startConnection().then(() => {
      this.ticketHubService.joinRoom(this.ticketId);
    });
  }


  ngOnDestroy(): void {
    this.ticketHubService.leaveRoom(this.ticketId);
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.ticketHubService.sendMessage(this.ticketId, this.user.name, this.newMessage);
      this.newMessage = ''; // Reset the message input
    }
  }
}
