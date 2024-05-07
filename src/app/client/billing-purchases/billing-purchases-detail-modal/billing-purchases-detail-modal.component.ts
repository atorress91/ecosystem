import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Invoice } from '@app/core/models/invoice-model/invoice.model';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-billing-purchases-detail-modal',
  templateUrl: './billing-purchases-detail-modal.component.html',
})
export class BillingPurchasesDetailModalComponent implements OnInit, OnDestroy {
  private invoice: Invoice = new Invoice();
  private user: UserAffiliate = new UserAffiliate();
  countries = [];
  private suscription: Subscription;
  private destroy$ = new Subject();
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  Math = Math;

  @ViewChild('billingPurchasesDetailModal')
  billingPurchasesDetailModal: NgbModal;

  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private affiliateService: AffiliateService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllCountries();
    this.getCurrentUser();

  }

  getAllCountries() {
    this.affiliateService.getCountries().subscribe({
      next: (resp) => {
        this.countries = resp;
      },
      error: (err) => {
        this.toastr.error('error');
      },
    });
  }

  getCountryName(id: number) {
    let countryName = '';
    this.countries.find((item) => {
      if (item.id === id) {
        countryName = item.name;
        return true;
      }
    })

    return countryName;
  }

  getCurrentUser() {
    this.suscription = this.auth.currentUserAffiliate
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.suscription.unsubscribe();
  }

  billingPurchasesOpenModal(content, invoice: Invoice) {
    this.totalDiscount = invoice.invoiceDetail[0].productDiscount;
    this.totalTax = invoice.invoiceDetail[0].productIva;
    const subTotal = invoice.invoiceDetail.reduce((accumulator, item) => {
      return accumulator + (item.productPrice * item.productQuantity);
    }, 0);


    this.subTotal = subTotal;


    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      centered: true,
    });
    this.invoice = invoice;
  }
}
