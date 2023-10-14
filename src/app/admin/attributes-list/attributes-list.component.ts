import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';

import { ProductAttributeService } from '@app/core/service/product-attribute/product-attribute.service';
import { ToastrService } from 'ngx-toastr';
import { PrintService } from '@app/core/service/print-service/print.service';

const header = ['Nombre', 'Descripción', 'No. Valores', 'Posición'];
@Component({
  selector: 'app-attributes-list',
  templateUrl: './attributes-list.component.html',
})
export class AttributesListComponent implements OnInit {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor(
    private modalService: NgbModal,
    private productAttributeService: ProductAttributeService,
    private toastr: ToastrService,
    private printService: PrintService
  ) {}

  ngOnInit(): void {
    this.loadAttributesList();
  }

  createOpenModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.table) {
      this.scrollBarHorizontal = window.innerWidth < 1200;
      this.table.recalculate();
      this.table.recalculateColumns();
    }
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

  loadAttributesList() {
    this.productAttributeService.getAll().subscribe((resp) => {
      if (resp != null) {
        this.temp = [...resp];
        this.rows = resp;
        this.loadingIndicator = false;
      }
    });
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
    this.productAttributeService.delete(id).subscribe((response) => {
      if (response.success) {
        this.deleteRecordSuccess(1);
        this.loadAttributesList();
      }
    });
  }

  onPrint() {
    const body = this.temp.map((items: any) => {
      const data = [items.name, items.description, items, items.position];

      return data;
    });

    this.printService.print(header, body, 'Lista de Atributos', false);
  }
}
