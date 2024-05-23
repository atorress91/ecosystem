export class TicketMessageRequest {
  ticketId: number;
  userId: number;
  messageContent: string;


  constructor() {
    this.ticketId = 0;
    this.userId = 0;
    this.messageContent = '';
  }
}
