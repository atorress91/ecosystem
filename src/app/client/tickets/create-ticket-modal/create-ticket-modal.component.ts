import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

import { TicketCategoriesService } from '@app/core/service/ticket-categories-service/ticket-categories.service';
import { TicketCategories } from '@app/core/models/ticket-categories-model/ticket-categories.model';
import { TicketRequest } from '@app/core/models/ticket-model/ticketRequest.model'
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { TicketService } from '@app/core/service/ticket-service/ticket.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-create-ticket-modal',
  templateUrl: './create-ticket-modal.component.html',
  styleUrls: ['./create-ticket-modal.component.scss']
})
export class CreateTicketModalComponent implements OnInit {
  createTicketForm: FormGroup;
  submitted: boolean = false;
  categories: TicketCategories[] = [];
  files: File[] = [];
  ticket: TicketRequest = new TicketRequest();
  user: UserAffiliate = new UserAffiliate();
  fileRef: any;
  uploadTask: any;
  @Output() reloadRequested = new EventEmitter<void>();
  @ViewChild('createTicketModal') createTicketModal: TemplateRef<any>;

  constructor(private modalService: NgbModal,
    private ticketCategoriesService: TicketCategoriesService,
    private storage: Storage,
    private authService: AuthService,
    private ticketService: TicketService,
    private toast: ToastrService
  ) { }

  ngOnInit() {
    this.user = this.authService.currentUserAffiliateValue;
    this.initCreateTicketForm();
    this.getAllTicketCategories()
  }

  initCreateTicketForm() {
    this.createTicketForm = new FormGroup({
      subject_ticket: new FormControl('', Validators.required),
      category: new FormControl("", Validators.required),
      description: new FormControl("", [Validators.required, Validators.maxLength(255)]),
    });
  }

  showSuccess(message: string) {
    this.toast.success(message);
  }

  showError(message: string) {
    this.toast.error(message);
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

  openModal() {
    this.modalService.open(this.createTicketModal, { size: 'lg', centered: true });
  }

  createTicket(): void {
    this.submitted = true;

    if (this.createTicketForm.invalid) return;

    this.ticket.affiliateId = this.user.id;
    this.ticket.subject = this.createTicketForm.get('subject_ticket').value;
    this.ticket.description = this.createTicketForm.get('description').value;
    this.ticket.categoryId = parseInt(this.createTicketForm.get('category').value);

    if (this.files && this.files.length > 0) {
      this.startTicketImageUpload();
    } else {
      this.saveTicket();
    }
  }

  onFileSelected(event: any): void {
    const files: File[] = Array.from(event.addedFiles);

    if (this.files.length + files.length <= 1) {
      this.files.push(...files);
    }

    const filePath = 'tickets/' + `${this.user.user_name}/` + `${this.user.id}`;
    this.fileRef = ref(this.storage, filePath);
  }

  private startTicketImageUpload(): void {
    this.uploadTask = uploadBytesResumable(this.fileRef, this.files[0]);

    this.uploadTask.on('state_changed',
      null,
      error => this.handleTicketUploadError(error),
      () => this.handleTicketUploadComplete()
    );
  }

  private handleTicketUploadError(error): void {
    this.toast.error('Error al cargar la imagen.');
  }

  private handleTicketUploadComplete(): void {
    getDownloadURL(this.uploadTask.snapshot.ref)
      .then(downloadURL => {
        this.ticket.image = downloadURL;
        this.saveTicket();
      })
      .catch(err => {
        this.toast.error('Error al obtener la URL de la imagen.');
      });
  }

  private saveTicket(): void {
    this.ticketService.createTicket(this.ticket).subscribe({
      next: (value) => {
        this.toast.success('Ticket creado correctamente!.');
        this.reloadRequested.emit();
        this.modalService.dismissAll();
      },
      error: (err) => {
        this.toast.error('Error al crear el ticket.');
      }
    });
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }
}
