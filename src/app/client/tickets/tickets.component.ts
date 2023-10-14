import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '@app/core/service/chat-service/chat.service';
import { ChatBotService } from '@app/core/service/chat-service/chat-bot.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit {
  public messages: Array<any> = [];
  currentTime: Date = new Date();
  @ViewChild('messageInput') messageInputRef: ElementRef;

  constructor(
    private chatService: ChatService,
    private chatBotService: ChatBotService
  ) { }

  ngOnInit() {
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
