import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { ConceptService } from '@app/core/service/concept-service/concept.service';
import { ConceptList } from '@app/core/models/concept-model/concept-list.model';
import { PaymentGroupsService } from '@app/core/service/payment-groups-service/payment-groups.service';
import { PaymentGroup } from '@app/core/models/payment-group-model/payment.group.model';
import { PayConcept } from '@app/core/models/concept-model/pay-concept.model';
import { PrintService } from '@app/core/service/print-service/print.service';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

const header = [
  'Nombre del Concepto',
  'Estado del concepto',
  'Grupo de calculo',
  'Pagar concepto a',
  'Calcular concepto',
  'Compresión',
  'Igualación',
];
@Component({
  selector: 'app-concept-list',
  templateUrl: './concept-list.component.html',
  providers: [ToastrService],
})
export class ConceptListComponent implements OnInit {
  rows = [];
  temp = [];
  properties: any = [];

  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor(
    private modalService: NgbModal,
    private conceptService: ConceptService,
    private printService: PrintService,
    private clipboardService: ClipboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadConceptList();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    if (this.table) {
      this.table.recalculate();
      this.table.recalculateColumns();
    }
  }

  getRowHeight(row) {
    return row.height;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  createOpenModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  loadConceptList() {
    this.conceptService.getAll().subscribe((resp: ConceptList[]) => {
      if (resp !== null) {
        this.temp = [...resp];
        this.rows = resp;
      }

      setTimeout(() => {
        this.loadingIndicator = false;
      }, 500);
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
    this.conceptService.delete(id).subscribe((response) => {
      if (response.success) {
        this.deleteRecordSuccess(1);
        this.loadConceptList();
      }
    });
  }

  onPrint() {
    const body = this.temp.map((items: any) => {
      const data = [
        items.name,
        items.active ? 'Activo' : 'Inactivo',
        items.paymentGroup.name,
        items.payConcept === 1
          ? 'Patrocinador Personal(Matrix Unilevel)'
          : 'Patrocinador de Ubicación(Matrix Forzada)',
        items.calculateBy === 1
          ? 'Calificación Igual (==)'
          : 'Calificación ó Mayor (>=)',
        items.compression ? 'Activo' : 'Inactivo',
        items.equalization ? 'Activo' : 'Inactivo',
      ];

      return data;
    });

    this.printService.print(header, body, 'Lista de Conceptos', false);
  }

  clipBoardCopy() {
    this.properties = [
      'name',
      'description',
      'status',
      'payConcept',
      'calculateBy',
      'compression',
      'equalization',
      'createdAt',
    ];

    let value = JSON.stringify(this.temp, this.properties);
    value = value.replace(/[[\]"']/g, '');
    this.clipboardService.copyFromContent(value);

    if (this.temp.length === 0) {
      this.toastr.info('No data to copy');
    } else {
      this.toastr.success('Copied ' + this.temp.length + ' rows successfully');
    }
  }
}
