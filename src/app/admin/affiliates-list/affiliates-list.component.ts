import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { PrintService } from '@app/core/service/print-service/print.service';
import { Router } from '@angular/router';

const header = [
  'Usuario',
  'Estado',
  'Modo Afiliado',
  'Calificación',
  'Correo',
  'Fecha Registro',
  'Padre',
  'Patrocinador',
  'Patrocinador Binario',
];
@Component({
  selector: 'app-affiliates-list',
  templateUrl: './affiliates-list.component.html',
  providers: [ToastrService],
})
export class AffiliatesListComponent implements OnInit {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor(
    private router: Router,
    private affiliateService: AffiliateService,
    private clipboardService: ClipboardService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private printService: PrintService
  ) {}

  ngOnInit() {
    this.loadAffiliateList();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }
  createOpenModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  closeModals() {
    this.modalService.dismissAll();
  }

  loadAffiliateList() {
    this.affiliateService.getAll().subscribe((affiliates: UserAffiliate[]) => {
      if (affiliates !== null) {
        this.temp = [...affiliates];
        this.rows = affiliates;
      }
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 500);
    });
  }

  getRowHeight(row) {
    return row.height;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.user_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  clipBoardCopy() {
    var string = JSON.stringify(this.temp);
    var result = this.clipboardService.copyFromContent(string);

    if (this.temp != null) {
      this.toastr.info('no data to copy');
    } else {
      this.toastr.success('copied ' + this.temp.length + ' rows successfully');
    }
  }

  onPrint() {
    const body = this.temp.map((items: UserAffiliate) => {
      const data = [
        items.user_name,
        items.status,
        items.affiliate_mode,
        items.external_grading_id,
        items.email,
        items.created_at,
        items.father,
        items.sponsor,
        items.binary_sponsor,
      ];
      return data;
    });

    this.printService.print(header, body, 'Lista de Afiliados', false);
  }

  onRouteUnilevelTree(id: number) {
    this.router.navigate([`admin/unilevel-tree/${id}`]);
  }

  onRouteForceGenealogicalTree() {
    this.router.navigate(['admin/force-genealogical-tree']);
  }

  onRouteBinaryGenealogicalTree(id: number) {
    this.router.navigate([`admin/binary-genealogical-tree/${id}`]);
  }
}
