import { MembershipManagerService } from '@app/core/service/membership-manager-service/membership-manager.service';
import { BalanceInformation } from '@app/core/models/wallet-model/balance-information.model';
import { WalletService } from '@app/core/service/wallet-service/wallet.service';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import Swal from 'sweetalert2';

import { Product } from '@app/core/models/product-model/product.model';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { ProductService } from '@app/core/service/product-service/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ProductsRequests, WalletRequest } from '@app/core/models/wallet-model/wallet-request.model';
import { ToastrService } from 'ngx-toastr';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-membership-manager',
  templateUrl: './membership-manager.component.html',
  styleUrls: ['./membership-manager-component.scss'],
})
export class MembershipManagerComponent implements OnInit, OnDestroy {
  payMethodSelected: number;
  memberships: Product[] = [];
  public user: UserAffiliate;
  currentMembership: Product = new Product();
  public isLoading: boolean = false;
  balanceInformation: BalanceInformation = new BalanceInformation();
  private suscription: Subscription;
  @ViewChild('membershipManagerModal', { static: true })
  membershipManagerModal!: TemplateRef<any>;
  private destroy$ = new Subject<void>();

  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private productService: ProductService,
    private walletService: WalletService,
    private toastr: ToastrService,
    private affiliateService: AffiliateService,
    private router: Router,
    private membershipManagerService: MembershipManagerService
  ) { }

  ngOnInit(): void {
    this.suscription = this.auth.currentUserAffiliate
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
      });

    this.membershipManagerService.showModal$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalService.open(this.membershipManagerModal, { backdrop: 'static', keyboard: false, centered: true, size: 'sm', scrollable: true });
      });

    this.loadAllMemberships();
    this.loadBalanceInformation();
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
    this.close();
    this.destroy$.next();
    this.destroy$.complete();
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.toastr.error(message);
  }

  loadAllMemberships() {
    this.productService.getAllMembership().subscribe({
      next: (resp) => {
        this.memberships = resp;
        this.currentMembership = this.memberships[0];
      },
      error: (err) => { },
    });
  }

  close() {
    this.membershipManagerService.closeModal$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalService.dismissAll();
      });
  }

  paymentMethodSelected() {
    this.payMethodSelected;
  }

  changeMembership() {
    const currentIndex = this.memberships.indexOf(this.currentMembership);
    const nextIndex = (currentIndex + 1) % this.memberships.length;
    this.currentMembership = this.memberships[nextIndex];
  }

  loadBalanceInformation() {
    this.walletService.getBalanceInformationByAffiliateId(this.user.id).subscribe({
      next: (value) => {
        this.balanceInformation.availableBalance = value.availableBalance;
      },
      error: (err) => {

      },
    })
  }

  payWithBalance() {
    let walletRequest: WalletRequest = new WalletRequest();
    let productRequest: ProductsRequests = new ProductsRequests();
    productRequest.idProduct = this.currentMembership.id;
    productRequest.count = 1;

    walletRequest.purchaseFor = 0;
    walletRequest.affiliateId = this.user.id;
    walletRequest.affiliateUserName = this.user.user_name;
    walletRequest.bank = 'Saldo de billetera';
    walletRequest.paymentMethod = 3;
    walletRequest.productsList.push(productRequest);

    this.walletService.payMembershipWithMyBalance(walletRequest).subscribe({
      next: (value) => {
        this.showSuccess('Pago realizado correctamente')
        this.modalService.dismissAll();
        this.refreshUserInfoData(this.user.id);
        this.router.navigateByUrl('/app/home', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/app/home']);
        });
      },
      error: (err) => {
        this.showError('Error!')
      },
    })
  }

  confirmTransaction() {
    if (this.balanceInformation.availableBalance >= this.currentMembership.salePrice) {
      return Swal.fire({
        title: '¿Está seguro que desea realizar la solicitud?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.payWithBalance();
        }
      });
    } else {
      this.toastr.error('No tienes suficiente balance para pagar la membresía.');
    }
  }

  refreshUserInfoData(id: number) {
    this.affiliateService.getAffiliateById(id).subscribe({
      next: (value) => {
        this.user = value.data;
        this.auth.setUserAffiliateValue(value.data);
      },
      error: (err) => {

      },
    })
  }

}
