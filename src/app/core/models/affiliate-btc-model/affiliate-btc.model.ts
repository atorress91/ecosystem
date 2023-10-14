export class AffiliateBtc {

  id: number;
  affiliate_id: number;
  password: string;
  verification_code: string;
  address: string;
  Status: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  constructor() {
    this.id = 0;
    this.affiliate_id = 0;
    this.password = '';
    this.address = '';
    this.verification_code = '';
    this.Status = 0;
    this.created_at = new Date();
    this.updated_at = new Date();
    this.deleted_at = new Date();
  }
}
