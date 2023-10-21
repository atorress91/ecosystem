import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create-ticket-modal',
  templateUrl: './create-ticket-modal.component.html',
  styleUrls: ['./create-ticket-modal.component.scss']
})
export class CreateTicketModalComponent implements OnInit {
  @ViewChild('createTicketModal') createTicketModal: NgbModal
  public Editor = ClassicEditor;

  constructor(private modalService: NgbModal) {

  }

  ngOnInit(): void {

  }

  openModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
  }


  createTicket() {

  }
}
