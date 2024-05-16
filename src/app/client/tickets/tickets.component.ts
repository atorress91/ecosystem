import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { TicketService } from '@app/core/service/ticket-service/ticket.service';
import { TicketCategoriesService } from '@app/core/service/ticket-categories-service/ticket-categories.service';
import { CreateTicketModalComponent } from './create-ticket-modal/create-ticket-modal.component';
import { TicketHubService } from '@app/core/service/ticket-service/ticket-hub.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Ticket } from '@app/core/models/ticket-model/ticket.model';
import Swal from 'sweetalert2';
declare var Viewer: any;

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html'
})
export class TicketsComponent implements OnInit, AfterViewInit, OnDestroy {
  user: UserAffiliate = new UserAffiliate();
  public messages: Array<any> = [];
  currentTime: Date = new Date();
  tickets = [];
  categories = [];

  @ViewChild(CreateTicketModalComponent) private createTicketModal: CreateTicketModalComponent;
  @ViewChild('messageInput') messageInputRef: ElementRef;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private ticketHubService: TicketHubService,
    private ticketCategoryService: TicketCategoriesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.ticketHubService.startConnection();
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
    ).subscribe(
      (tickets) => {
        this.tickets = tickets;
      },
      (error) => {
        console.error('Error retrieving tickets:', error);
      }
    );
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

  updateCurrentTime(): void {
    this.currentTime = new Date();
  }

  openTicketDetails(ticket: Ticket) {
    this.ticketHubService.setTicket(ticket);
    console.log('Ticket:', ticket);
    this.router.navigate(['app/tickets/message']);
  }

  showImage(imageUrl: string) {
    const image = new Image();
    image.src = imageUrl;
    const viewer = new Viewer(image, {
      inline: false,
      button: true,
      navbar: true,
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 1,
        play: {
          show: 1,
          size: 'large',
        },
        next: 1,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
      tooltip: true,
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: true,
      transition: true,
      fullscreen: true,
      viewed() {
        viewer.zoomTo(1);
      }
    });

    viewer.show();
  }

  openViewer(imageUrl: string) {
    this.showImage(imageUrl);
  }
}
