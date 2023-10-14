import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { PrintService } from '@app/core/service/print-service/print.service';
import { ProductInventoryService } from '@app/core/service/product-inventory-service/product-inventory.service';
import { ProductInventory } from '@app/core/models/product-inventory-model/product-inventory.model';

const header = ['Ingreso', 'Egreso', 'Soporte', 'Nota', 'Tipo', 'Fecha'];
@Component({
  selector: 'app-products-and-services-movements-modal',
  templateUrl: './products-and-services-movements-modal.component.html',
})
export class ProductsAndServicesMovementsModalComponent implements OnInit {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  productInventory: ProductInventory = new ProductInventory();

  @ViewChild('tableMovements') tableMovements: DatatableComponent;

  constructor(
    private modalService: NgbModal,
    private printService: PrintService,
    private productInventoryService: ProductInventoryService
  ) {}

  @ViewChild('movementsProductsModal') movementsProductsModal: NgbModal;

  ngOnInit(): void {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.tableMovements) {
      this.scrollBarHorizontal = window.innerWidth < 1200;
      this.tableMovements.recalculate();
      this.tableMovements.recalculateColumns();
    }
  }

  movementsOpenModal(content, row) {
    this.productInventory.idProduct = row.id;
    this.loadMovementsList(this.productInventory.idProduct);
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  loadMovementsList(id: number) {
    this.productInventoryService
      .getProductsInventoryByProductId(id)
      .subscribe((resp: ProductInventory[]) => {
        if (resp != null) {
          this.temp = [...resp];
          this.rows = resp;
          this.loadingIndicator = false;
        }
      });
  }

  onPrint() {
    const body = this.temp.map((items: ProductInventory) => {
      const data = [
        items.ingress,
        items.egress,
        items.support,
        items.note,
        items.type,
        items.date
      ];

      return data;
    });

    this.printService.print(
      header,
      body,
      'Lista de Movimientos del Producto',
      false
    );
  }
}
