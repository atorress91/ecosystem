import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services-and-products',
  templateUrl: './services-and-products.component.html',
  styleUrls: ['./services-and-products.component.sass']
})
export class ServicesAndProductsComponent implements OnInit {
  active: any;

  constructor(private toast: ToastrService) {

  }

  ngOnInit(): void {

  }

  showAlert() {
    Swal.fire({
      title: 'Novedades en camino',
      html: `
            <p>¡Estamos emocionados de anunciar que próximamente estarán disponibles nuevos servicios y productos!</p>
            <p>Manténgase al tanto para descubrir lo que hemos preparado para usted.</p>
        `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3085d6',
      showCancelButton: false,
    }).then((result) => {
      if (result.isConfirmed) {

      }
    });
  }

  onTabChange(newActive: number) {
    this.active = newActive;
  }
}
