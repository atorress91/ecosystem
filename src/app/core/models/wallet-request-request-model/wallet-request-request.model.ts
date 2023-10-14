export class WalletRequestRequest {
  id?: number;
  status?: number;
  affiliateId: number;
  affiliateName: string;
  userPassword: string;
  verificationCode: string;
  amount: number;
  concept: string;
  retention?: number;
  isSelected?: boolean;

  constructor() {
    this.affiliateId = 0;
    this.amount = 0;
    this.concept = '';
    this.userPassword = '';
    this.verificationCode = '';
    this.affiliateName = '';
  }
}
