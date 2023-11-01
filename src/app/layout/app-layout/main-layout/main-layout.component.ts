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
      title: 'Actualización Importante',
      html: `
            <strong>Resumen de nuevas estrategias:</strong>
            <ul class="list-unstyled">
            <li>Saldo revertido.</li>
            <li>Estructuración completa del modelo 4.</li>
            <li>Lanzamiento de la academia de trading.</li>
            <li>Disponibilidad de cuentas de fondeo.</li>
            </ul>
            <br>
            <strong>Notas Adicionales:</strong>
            <ul class="list-unstyled">
            <li>En noviembre se estarán dando detalles para las fechas de pago.</li>
            <li>Se realizarán cambios en el código de seguridad.</li>
            <li>Estás siendo invitado a una reunión especial a través de Zoom el <strong>1 de noviembre del 2023</strong>. Puedes unirte a la reunión a través del siguiente <a href="https://us02web.zoom.us/j/3242911575?pwd=clMzOTNheDErWDFaQU9QUFFXSjRZdz09#success" target="_blank" rel="noopener noreferrer" class="col-blue">ENLACE</a>. Horarios de la reunión:
                <ul class="list-unstyled">
                <br>
                <li><strong>9:30 pm</strong> España.</li>
                <li><strong>2:30 pm</strong> México y Centroamérica.</li>
                <li><strong>3:30 pm</strong> Sudamérica y Panamá.</li>
                </ul>
            </li>
            </ul>
        `,
      icon: 'info',
      confirmButtonText: 'Entendido',
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
