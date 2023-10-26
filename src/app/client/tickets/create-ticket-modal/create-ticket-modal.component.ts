
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TicketCategoriesService } from '@app/core/service/ticket-categories-service/ticket-categories.service';
import { TicketCategories } from '@app/core/models/ticket-categories-model/ticket-categories.model';
@Component({
  selector: 'app-create-ticket-modal',
  templateUrl: './create-ticket-modal.component.html',
  styleUrls: ['./create-ticket-modal.component.scss']
})
export class CreateTicketModalComponent implements OnInit {
  createTicketForm: FormGroup;
  categories: TicketCategories[] = [];
  @ViewChild('createTicketModal') createTicketModal: NgbModal
  public Editor = ClassicEditor;

  constructor(private modalService: NgbModal, private ticketCategoriesService: TicketCategoriesService) {
    this.createTicketForm = new FormGroup({});
  }

  ngOnInit() {
    this.initCreateTicketForm();
    this.getAllTicketCategories()
  }

  initCreateTicketForm() {
    this.createTicketForm.setControl('subject', new FormControl('', Validators.required));
    this.createTicketForm.setControl('category', new FormControl('', Validators.required));
    this.createTicketForm.setControl('description', new FormControl(''));
  }

  getAllTicketCategories() {
    this.ticketCategoriesService.getAll().subscribe({
      next: (value: TicketCategories[]) => {
        this.categories = value;
      },
      error: (err) => {

      },
    })
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
