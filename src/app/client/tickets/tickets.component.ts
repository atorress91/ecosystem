import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ChatBotService } from '@app/core/service/chat-service/chat-bot.service';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { TicketService } from '@app/core/service/ticket-service/ticket.service';
import { Tick } from '@amcharts/amcharts4/.internal/charts/elements/Tick';
import { Ticket } from '@app/core/models/ticket-model/ticket.model';
import { TicketCategories } from '@app/core/models/ticket-categories-model/ticket-categories.model';
import { TicketCategoriesService } from '@app/core/service/ticket-categories-service/ticket-categories.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit {
  user: UserAffiliate = new UserAffiliate();
  public messages: Array<any> = [];
  currentTime: Date = new Date();
  tickets = [];
  categories = [];
  @ViewChild('messageInput') messageInputRef: ElementRef;

  constructor(
    private chatBotService: ChatBotService,
    private authService: AuthService,
    private ticketService: TicketService,
    private ticketCategoryService: TicketCategoriesService
  ) { }

  ngOnInit() {
    this.user = this.authService.currentUserAffiliateValue;
    this.loadTickets();
    this.loadTicketCategories();
  }

  loadTickets() {
    this.ticketService.getAllTicketsByAffiliateId(this.user.id).subscribe({
      next: (value) => {
        this.tickets = value;
        console.log(this.tickets);
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  loadTicketCategories() {
    this.ticketCategoryService.getAll().subscribe({
      next: (value) => {
        this.categories = value;
        console.log(this.categories);
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.categoryName : 'Categoría no encontrada';
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
