import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {TicketCategoriesService} from '@app/core/service/ticket-categories-service/ticket-categories.service';
import {CreateTicketModalComponent} from './create-ticket-modal/create-ticket-modal.component';
import {TicketHubService} from '@app/core/service/ticket-service/ticket-hub.service';
import {AuthService} from '@app/core/service/authentication-service/auth.service';
import {UserAffiliate} from '@app/core/models/user-affiliate-model/user.affiliate.model';
import {Ticket} from '@app/core/models/ticket-model/ticket.model';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit, AfterViewInit, OnDestroy {
  user: UserAffiliate = new UserAffiliate();
  public messages: Array<any> = [];
  tickets: Ticket[] = [];
  categories = [];
  selectedTicket: any = {};

  @ViewChild(CreateTicketModalComponent) private createTicketModal: CreateTicketModalComponent;
  @ViewChild('messageInput') messageInputRef: ElementRef;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private ticketHubService: TicketHubService,
    private ticketCategoryService: TicketCategoriesService,
    private router: Router,
    private modalService: NgbModal
  ) {
  }

  async ngOnInit() {
    try {
      await this.ticketHubService.startConnection();
    } catch (error) {
      console.error('Error starting connection:', error);
    }
    this.user = this.authService.currentUserAffiliateValue;
    this.initSignalRConnection();
    this.loadTicketCategories();
  }

  ngAfterViewInit(): void {
    this.createTicketModal.reloadRequested.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.loadAllTickets();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.ticketHubService.stopConnection();
  }

  initSignalRConnection() {
    this.ticketHubService.connectionEstablished.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((isConnected) => {
      if (isConnected) {
        this.loadAllTickets();
      } else {
        console.error('Failed to establish connection');
      }
    });
  }

  loadAllTickets() {
    this.ticketHubService.getAllTicketsByAffiliateId(this.user.id).pipe(
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

  openCreateTicketModal() {
    this.createTicketModal.openModal();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.categoryName : 'Categoría no encontrada';
  }

  openTicketDetails(ticket: Ticket) {
    this.ticketHubService.setTicket(ticket);
    console.log('Ticket:', ticket);
    this.router.navigate(['app/tickets/message']).then();
  }

  openModal(content: any, ticket: Ticket) {
    console.log(ticket.images);
    this.selectedTicket.images = ticket.images || [];
    console.log(this.selectedTicket.images);
    this.modalService.open(content, {size: 'lg', centered: true}).result.then(() => {
    });
  }
}
