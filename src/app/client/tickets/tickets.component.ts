import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { TicketService } from '@app/core/service/ticket-service/ticket.service';
import { TicketCategoriesService } from '@app/core/service/ticket-categories-service/ticket-categories.service';
import { CreateTicketModalComponent } from './create-ticket-modal/create-ticket-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit, AfterViewInit {
  user: UserAffiliate = new UserAffiliate();
  public messages: Array<any> = [];
  currentTime: Date = new Date();
  tickets = [];
  categories = [];
  @ViewChild(CreateTicketModalComponent) private createTicketModal: CreateTicketModalComponent;
  @ViewChild('messageInput') messageInputRef: ElementRef;

  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
    private ticketCategoryService: TicketCategoriesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = this.authService.currentUserAffiliateValue;
    this.loadAllTickets();
    this.loadTicketCategories();
  }

  ngAfterViewInit(): void {
    this.createTicketModal.reloadRequested.subscribe(() => {
      this.loadAllTickets();
    });
  }

  loadAllTickets() {
    this.ticketService.getAllTicketsByAffiliateId(this.user.id).subscribe({
      next: (value) => {
        this.tickets = value;
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
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  openCreateTicketModal() {
    this.createTicketModal.openModal();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.categoryName : 'Categoría no encontrada';
  }

  updateCurrentTime(): void {
    this.currentTime = new Date();
  }

  openTicketDetails(ticket) {
    this.router.navigate(['/app/tickets', ticket.id], {
      state: { ticket: ticket }
    });
  }

}
