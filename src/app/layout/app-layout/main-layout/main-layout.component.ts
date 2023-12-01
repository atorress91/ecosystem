import { MembershipManagerService } from '@app/core/service/membership-manager-service/membership-manager.service';
import { Component, OnInit } from '@angular/core';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { DocumentCheckService } from '@app/core/service/document-check-service/document-check.service';
import { TermsConditionsService } from '@app/core/service/terms-conditions-service/terms-conditions.service';
import Swal from 'sweetalert2';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: [],
})
export class MainLayoutComponent implements OnInit {
  user: UserAffiliate = new UserAffiliate();
  constructor(
    private documentCheckService: DocumentCheckService,
    private termsConditionsService: TermsConditionsService,
    private authService: AuthService,
    private membershipManagerService: MembershipManagerService,
    private affiliateService: AffiliateService,
    private toast: ToastrService) { }

  ngOnInit() {
    this.user = this.authService.currentUserAffiliateValue;
    if (this.user.message_alert == 0) {
      this.showAlert();
    }
  }

  ngAfterViewInit(): void {
    if (!this.user.termsConditions) {
      this.showTermsConditionsModal();
    }

    if (this.user.activation_date == null) {
      this.showMembershipManager();
    }
  }

  showMembershipManager() {
    this.membershipManagerService.show();
  }

  showTermsConditionsModal() {
    this.termsConditionsService.show();
  }

  messageReceived() {
    this.affiliateService.updateMessageAlert(this.user.id).subscribe({
      next: (value) => {
        this.showSuccess('Mensaje recibido correctamente');
        this.authService.setUserAffiliateValue(this.user);
      },
      error: (err) => {
        this.showError('Error');
      },
    })
  }

  showAlert() {
    Swal.fire({
      icon: "info",
      title: '🚨 ATENCIÓN 🚨',
      html: `
            <p>Saludos cordiales,</p>
            <p>Deseamos informarles que, debido a la implementación del saldo revertido y el modelo 3 y 4 en nuestro e-commerce, experimentaremos un retraso en el cierre del presente mes. El cierre se llevará a cabo el día 15, con el pago correspondiente programado para el día 19. Agradecemos su comprensión ante cualquier inconveniente que esto pueda ocasionar. Estamos trabajando diligentemente para garantizar una transición fluida.</p>
            <p>Atentamente Dep administrativo.</p>
        `,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
      showCancelButton: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.messageReceived();
      }
    });
  }

  showSuccess(message: string) {
    this.toast.success(message);
  }

  showError(message: string) {
    this.toast.error(message);
  }
}
