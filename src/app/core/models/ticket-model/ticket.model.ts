export class Ticket {
  id: number;
  affiliateId: number;
  categoryId: number;
  subject: string;
  status: boolean;
  isRead: boolean;
  image: string;
  createdAt: Date
  updatedAt: Date
  deletedAt: Date

  constructor() {
    this.id = 0;
    this.affiliateId = 0;
    this.categoryId = 0;
    this.subject = '';
    this.status = false;
    this.isRead = false;
    this.image = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
