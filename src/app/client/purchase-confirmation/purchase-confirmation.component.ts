import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-confirm',
  templateUrl: './purchase-confirmation.component.html',
  styleUrls: ['./purchase-confirmation.component.sass']
})
export class PurchaseConfirmationComponent {
  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const token = params['parametro1'];
      const comprobante = params['parametro2'];

      if (token && comprobante) {
        this.showConfirmationAlert(token, comprobante);
      }
    });
  }

  private showConfirmationAlert(token: string, comprobante: string): void {
    Swal.fire({
      title: 'Confirmación de Compra',
      html: `Su compra se ha procesado correctamente, por favor dar click en Ok para ser dirigido a su oficina!<br>Transaction Token: ${token}<br>Receipt Number: ${comprobante}`,
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/app/home']);
      }
    });
  }

}
