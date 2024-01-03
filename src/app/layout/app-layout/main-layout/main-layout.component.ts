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
      title: 'Asunto: Confirmación y Elección del Modelo para la distribución de Ecopooles Educativos',
      html: `
            <p>Estimado/a Cliente,</p>
            <p>Espero que este mensaje le encuentre bien. En referencia a la reunión de Zoom que tuvo lugar el pasado 3 de enero de 2024, en la cual se proporcionaron detalles sobre los modelos de trabajo de la compañía, agradecemos su participación y atención a este importante asunto.</p>
            <p>En cumplimiento con las normativas vigentes asociadas con nuestro modelo de negocio, solicitamos su confirmación y elección respecto al modelo que considere más adecuado para la colocación de sus Ecopooles. Cabe destacar que la transparencia y la conformidad con los requisitos voluntarios son fundamentales para el éxito de nuestras operaciones.</p>
            <p>Agradeceríamos recibir su confirmación y elección lo antes posible, con el fin de avanzar en la implementación y asegurar una transición efectiva hacia la generación de comisiones voluntarias para los clientes.</p>
            <p>Por favor, envíe un correo a administracion@ecosystemfx.com adjuntando el nombre del usuario y modelo elegido con el monto. Una vez solicitado el modelo se pondrá a disposición en la oficina para que realice las compras en el o los modelos elegidos de manera personal.</p>
            <p>Agradecemos su compromiso y cooperación en este proceso vital para continuar nuestro éxito de por vida y le reiteramos nuestro firme compromiso con el cumplimiento normativo.</p>
            <p>Saludos cordiales,</p>
            <p>CEO Alvaro Rodríguez.</p>
        `,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
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
