export class TicketMessage {
  id: number;
  ticketId: number;
  userId: number;
  messageContent: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isRead: boolean;

  constructor(ticketId: number, userId: number, messageContent: string) {
    this.ticketId = 0;
    this.userId = 0;
    this.messageContent = '';
    this.isRead = false;
  }
}
