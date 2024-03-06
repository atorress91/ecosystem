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
      const reference = params['parametro2'];

      if (token && reference) {
        this.showConfirmationAlert(token, reference);
      }
    });
  }

  private showConfirmationAlert(token: string, reference: string): void {
    let counter = 10;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    const swalTimerInterval = setInterval(() => {
      const content = Swal.getHtmlContainer().querySelector('b') as HTMLElement;
      if (content) {
        content.textContent = String(counter);
      }
      if (counter === 0) {
        clearInterval(swalTimerInterval);
      }
      counter--;
    }, 1000);

    swalWithBootstrapButtons.fire({
      title: 'Confirmación de Compra',
      html: `Su compra se ha procesado correctamente, pronto será redireccionado a su oficina en <b></b> segundos.<br><br>Transaction Token: <strong> ${token} </strong><br>Receipt Number: <strong> ${reference} </strong>`,
      icon: 'success',
      timer: 10000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        this.router.navigate(['/app/home']);
      }
    });
  }
}
