import { Injectable, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Injectable()
export class ConfigureWalletService {
  configureWalletModal: TemplateRef<any>;
  activeModal: any;
  private modalOpenedSource = new Subject<void>();
  modalOpened$ = this.modalOpenedSource.asObservable();

  constructor(private modalService: NgbModal) { }

  setModalContent(content: TemplateRef<any>) {
    this.configureWalletModal = content;
  }

  openConfigureWalletModal() {
    if (!this.configureWalletModal) {
      throw new Error('Error');
    }
    this.activeModal = this.modalService.open(this.configureWalletModal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true
    });

    this.modalOpenedSource.next();
  }

  closeConfigureWalletModal() {
    this.activeModal.close();
  }
}
