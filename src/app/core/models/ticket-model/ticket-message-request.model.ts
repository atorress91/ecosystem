export class TicketMessageRequest {
  id: number;
  ticketId: number;
  sentBy: number;
  userId: number;
  messageContent: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isRead: boolean;

  constructor() {
    this.id = 0;
    this.ticketId = 0;
    this.sentBy = 0;
    this.userId = 0;
    this.messageContent = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = new Date();
    this.isRead = false;
  }
}
