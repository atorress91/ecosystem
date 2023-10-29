export class Ticket {
  affiliateId: number;
  categoryId: number;
  subject: string;
  image: string;

  constructor() {
    this.affiliateId = 0;
    this.categoryId = 0;
    this.subject = '';
    this.image = '';
  }
}
