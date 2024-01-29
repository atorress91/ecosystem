export class TicketRequest {
  affiliateId: number;
  categoryId: number;
  subject: string;
  description: string;
  image: string;

  constructor() {
    this.affiliateId = 0;
    this.categoryId = 0;
    this.subject = '';
    this.description = '';
    this.image = '';
  }
}
