import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '@app/core/service/chat-service/chat.service';
import { ChatBotService } from '@app/core/service/chat-service/chat-bot.service';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit {
  user: UserAffiliate = new UserAffiliate();
  public messages: Array<any> = [];
  currentTime: Date = new Date();
  @ViewChild('messageInput') messageInputRef: ElementRef;

  constructor(
    private chatBotService: ChatBotService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.user = this.authService.currentUserAffiliateValue;
  }

  updateCurrentTime(): void {
    this.currentTime = new Date();
  }

  sendMessage(messageContent: string): void {
    this.updateCurrentTime();
    this.messages.push({ content: messageContent, isUser: true, time: this.currentTime });

    this.chatBotService.getDataFromOpenAI(messageContent).subscribe(response => {
      this.updateCurrentTime();
      this.messages.push({ content: response, isUser: false, time: this.currentTime });
    });
    this.messageInputRef.nativeElement.value = '';
  }
}
