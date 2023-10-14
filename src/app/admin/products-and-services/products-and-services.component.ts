import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { ProductService } from '@app/core/service/product-service/product.service';
import { Product } from '@app/core/models/product-model/product.model';
import { PrintService } from '@app/core/service/print-service/print.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from '@app/core/service/configuration-service/configuration.service';
import { ProductConfiguration } from '@app/core/models/product-configuration-model/product-configuration.model';

const header = [
  'Código del Producto',
  'Nombre del Producto',
  'Tipo',
  'Val. Comisionable',
  'Vol. Puntos',
  'Precio de Venta',
  'Existencias',
];
@Component({
  selector: 'app-products-and-services',
  templateUrl: './products-and-services.component.html',
})
export class ProductsAndServicesComponent implements OnInit {
  rows = [];
  temp = [];
  productConfiguration: ProductConfiguration = new ProductConfiguration();

  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor(
    private modalService: NgbModal,
    private productService: ProductService,
    private printService: PrintService,
    private toastr: ToastrService,
    private configurationService: ConfigurationService
  ) { }

  ngOnInit(): void {
    this.loadProductList();
    this.loadProductConfiguration();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    if (this.table) {
      this.table.recalculate();
      this.table.recalculateColumns();
    }
  }

  loadProductList() {
    this.productService.getAllProductsAdmin().subscribe((resp: Product[]) => {
      this.temp = [...resp];
      this.rows = resp;
      this.loadingIndicator = false;
    });
  }

  loadProductConfiguration() {
    this.configurationService.getProductConfiguration().subscribe((resp: ProductConfiguration) => {
      if (resp != null) {
        this.productConfiguration = resp;
      }
    });
  }

  getRowHeight(row) {
    return row.height;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  createOpenModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  onPrint() {
    const body = this.temp.map((items: any) => {
      const data = [
        items.productCode,
        items.name,
        items.productType ? 'Afiliación' : 'Producto',
        'COM ' + items.commissionableValue,
        'PNT ' + items.valuePoints,
        'USD ' + items.salePrice,
        items.inventory ? '∞' : '0',
      ];

      return data;
    });

    this.printService.print(header, body, 'Lista de Productos', false);
  }

  deleteSingleRow(value) {
    Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonColor: '#8963ff',
      cancelButtonColor: '#fb7823',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.deleteRecord(value);
      }
    });
  }

  deleteRecordSuccess(count) {
    this.toastr.success(count + ' Records Deleted Successfully', '');
  }

  deleteRecord(id: number) {
    this.productService.delete(id).subscribe((response) => {
      if (response.success) {
        this.deleteRecordSuccess(1);
        this.loadProductList();
      }
    });
  }
}
