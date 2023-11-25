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
            <p>🚨 ECOSYSTEM ROMPIENDO ESQUEMAS 🚨</p>
            <p>Presentadores Internacional.</p>
            <p>✅  Álvaro Rodríguez (CEO)</p>
            <p>✅  Profesores Academia Trading.</p>
            <p>Gran Evento On-Line. Lanzamiento Tienda Virtual. Academia de Trading, Cuentas de Fondeo</p>
            <p>Habra 1 Rifa para Clientes e Invitados: Pago Curso 4 semanas de la Academia de Trading, y una cuenta de Fondeo.</p>
            <p>Aprovecha esta Gran Oportunidad para Incrementar tus Ganancias.</p>
            <p>El Link para Ingresar a la Reunión, deberás visitar las Redes Sociales</p>
            <p style="margin-top: 10px;"><strong>Horarios de Inicio:</strong></p>
            <p><strong>2:30 PM – MÉXICO </strong><img src="https://humanidades.com/wp-content/uploads/2017/05/bandera-de-mexico-e1567990911570-800x400.jpg" alt="Bandera México" width="20px"></p>
            <p><strong>4:00 PM - VENEZUELA </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Flag_of_Venezuela_%28state%29.svg/200px-Flag_of_Venezuela_%28state%29.svg.png" alt="Bandera Venezuela" width="20px"></p>
            <p><strong>2:30 PM - COSTA RICA </strong><img src="https://images.visitarcostarica.com/thumbs/bandera-de-costa-rica.jpg" alt="Bandera CR" width="20px"></p>
            <p><strong>3:30 PM - CUBA </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Flag_of_Cuba.svg/800px-Flag_of_Cuba.svg.png" alt="Bandera Cuba" width="20px"></p>
            <p><strong>9:30 AM - ESPAÑA </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/200px-Bandera_de_Espa%C3%B1a.svg.png" alt="Bandera espana" width="20px"></p>
            <p><strong>3:30 PM - PERÚ </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Peru.svg/200px-Flag_of_Peru.svg.png" alt="Bandera peru" width="20px"></p>
            <p><strong>3:30 PM - MIAMI </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Flag_of_Miami%2C_Florida.svg/800px-Flag_of_Miami%2C_Florida.svg.png" alt="Bandera Miami" width="20px"></p>
            <p><strong>2:30 PM - NICARAGUA </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Nicaragua.svg/200px-Flag_of_Nicaragua.svg.png" alt="Bandera Nica" width="20px"></p>
            <p><strong>2:30 PM - GUATEMALA </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Flag_of_Guatemala.svg/200px-Flag_of_Guatemala.svg.png" alt="Bandera Guatemala" width="20px"></p>
            <p><strong>3:30 PM - COLOMBIA </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/200px-Flag_of_Colombia.svg.png" alt="Bandera Colombia" width="20px"></p>
            <p><strong>3:30 PM - ECUADOR </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Flag_of_Ecuador.svg/200px-Flag_of_Ecuador.svg.png" alt="Bandera Ecuador" width="20px"></p>
            <p><strong>4:30 PM - BOLIVIA </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Bolivia.svg/200px-Flag_of_Bolivia.svg.png" alt="Bandera Bolivia" width="20px"></p>
            <p><strong>5:30 PM - REP. DOMINICANA </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_the_Dominican_Republic.svg/800px-Flag_of_the_Dominican_Republic.svg.png" alt="Bandera Re.Dominicana" width="20px"></p>
            <p><strong>5:30 PM - CHILE </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_Chile.svg/800px-Flag_of_Chile.svg.png" alt="Bandera Chile" width="20px"></p>
            <p><strong>2:30 PM - EL SALVADOR </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_El_Salvador.svg/800px-Flag_of_El_Salvador.svg.png" alt="Bandera El Salvador" width="20px"></p>
            <p><strong>2:30 PM - HONDURAS </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Flag_of_Honduras_%281949%E2%80%932022%29.svg/800px-Flag_of_Honduras_%281949%E2%80%932022%29.svg.png" alt="Bandera Honduras" width="20px"></p>
            <p><strong>3:30 PM - PANAMÁ </strong><img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Panama_%281903%29.svg" alt="Bandera Panama" width="20px"></p>
            <p><strong>5:30 PM - BRASIL </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/200px-Flag_of_Brazil.svg.png" alt="Bandera Brasil" width="20px"></p>
            <p><strong>5:30 PM - ARGENTINA </strong><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/200px-Flag_of_Argentina.svg.png" alt="Bandera Argentina" width="20px"></p>
            <p><strong>DOMINGO 26 NOVIEMBRE 2023</strong></p>
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
