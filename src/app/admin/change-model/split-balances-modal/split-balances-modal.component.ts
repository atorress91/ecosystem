import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-split-balances-modal',
  templateUrl: './split-balances-modal.component.html',
  styleUrls: ['./split-balances-modal.component.sass']
})
export class SplitBalancesModalComponent {
  @ViewChild('splitBalancesModal') splitBalancesModal: TemplateRef<any>;

  constructor(private modalService: NgbModal) { }

  initModal() {
    this.modalService.open(this.splitBalancesModal, { size: 'lg', centered: true });
  }
}
