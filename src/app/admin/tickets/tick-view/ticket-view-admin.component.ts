import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import Swal from "sweetalert2";
import {Subject, Subscription} from "rxjs";

import {TicketHubService} from "@app/core/service/ticket-service/ticket-hub.service";
import {AuthService} from "@app/core/service/authentication-service/auth.service";
import {TicketMessage} from "@app/core/models/ticket-model/ticket-message.model";
import {TicketMessageRequest} from "@app/core/models/ticket-model/ticket-message-request.model";
import {Ticket} from "@app/core/models/ticket-model/ticket.model";

@Component({
  selector: 'app-tick-view',
  templateUrl: './ticket-view-admin.component.html',
  styleUrls: ['./ticket-view-admin.component.sass']
})
export class TicketViewAdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user: any;
  ticket: Ticket;
  config = {
    wheelSpeed: 0.5,
    swipeEasing: true,
    minScrollbarLength: 20,
    maxScrollbarLength: 50,
  };
  newMessage: string;
  ticketMessage: TicketMessageRequest = new TicketMessageRequest();
  messages: any = [];

  constructor(private ticketHubService: TicketHubService, private authService: AuthService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.user = this.authService.currentUserAdminValue;
    this.ticketHubService.getTicket().subscribe(ticketId => {
      this.startConnection(ticketId);
    });
  }

  ngOnDestroy(): void {
    this.ticketHubService.leaveRoom(this.ticket.id);
    this.destroy$.next();
    this.destroy$.complete();
  }

  startConnection(ticketId: number) {
    this.ticketHubService.startConnection().then(() => {
        this.ticketHubService.joinRoom(ticketId).then();
        this.getTicketById(ticketId);
        this.receivedMessage();
      },
      error => console.error('Error al conectar o unirse a la sala:', error)
    );
  }

  showTicketDetails() {
    Swal.fire({
      title: `Detalles del Ticket ${this.ticket.id}`,
      text: this.ticket.description,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    }).then();
  }

  getTicketById(ticketId: number) {
    this.ticketHubService.getTicketById(ticketId);
    this.ticketHubService.ticketCreated.subscribe({
      next: (ticket: Ticket | null) => {
        if (ticket) {
          this.ticket = ticket;
          if (ticket.messages && ticket.messages.length > 0) {
            ticket.messages.forEach(message => this.processMessageSender(message));
          } else {
            console.log('Ticket received without messages');
          }
        } else {
          console.log('No ticket received or connection not established');
        }
      },
      error: (err) => {
        console.error('Error recibiendo ticket:', err);
      }
    });
  }

  receivedMessage(): Subscription {
    return this.ticketHubService.messageReceived.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (message: TicketMessage) => this.processMessageSender(message),
      error: (err) => console.error('Error recibiendo mensajes:', err)
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.ticketHubService.connectionEstablished.value) {
      this.ticketMessage.ticketId = this.ticket.id;
      this.ticketMessage.userId = this.user.id;
      this.ticketMessage.messageContent = this.newMessage;

      this.ticketHubService.sendMessage(this.ticketMessage);
      this.newMessage = '';
    } else {
      console.error('Intento de enviar mensaje con la conexión no establecida.');
    }
  }

  processMessageSender(message: TicketMessage) {
    console.log('Procesando mensaje', message);
    const isMyMessage = message.userId === this.user.id;
    const formattedMessage = {
      ...message,
      sentByMe: isMyMessage
    };

    if (!this.messages.some((m: TicketMessage) => m.id === message.id)) {
      this.messages.push(formattedMessage);
      // this.cdr.detectChanges();
    }
  }

  isAdmin(userId: number): boolean {
    return userId == this.user.id;
  }
}
