import {Component, OnInit} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

import {TicketHubService} from "@app/core/service/ticket-service/ticket-hub.service";
import {Ticket} from "@app/core/models/ticket-model/ticket.model";
import {TicketCategoriesService} from "@app/core/service/ticket-categories-service/ticket-categories.service";
import {TicketCategories} from "@app/core/models/ticket-categories-model/ticket-categories.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tickets-admin',
  templateUrl: './tickets-admin.component.html',
})
export class TicketsAdminComponent implements OnInit {
  tickets: Ticket[] = [];
  private unsubscribe$ = new Subject<void>();
  categories: TicketCategories[] = [];
  user: any;

  constructor(private ticketHubService: TicketHubService,
              private ticketCategoryService: TicketCategoriesService,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.ticketHubService.startConnection();
    } catch (error) {
      console.error('Error starting connection:', error);
    }
    this.loadTicketCategories();
    this.getAllTickets();
    console.log(this.user);
  }

  loadTicketCategories() {
    this.ticketCategoryService.getAll().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe({
      next: (value) => {
        this.categories = value;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.categoryName : 'Categoría no encontrada';
  }

  getAllTickets() {
    this.ticketHubService.getAllTickets().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        console.log(this.tickets);
      },
      error: (error) => {
        console.error('Error retrieving tickets:', error);
      }
    });
  }

  openTicketMessage(ticket: Ticket) {
    this.ticketHubService.setTicket(ticket);
    console.log('Ticket:', ticket);
    this.router.navigate(['admin/ticket-for-admin/message']).then();
  }
}
