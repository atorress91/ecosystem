import { Component, ViewChild, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-profile-edit-password-upload-modal',
  templateUrl: './my-profile-edit-password-upload-modal.component.html',
})
export class MyProfileEditPasswordUploadModalComponent implements OnInit {
  editPasswordUploadForm: FormGroup;
  submitted = false;
  @ViewChild('editPasswordUploadModal') editPasswordUploadModal: NgbModal;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadValidations();
  }

  loadValidations() {
    this.editPasswordUploadForm = this.formBuilder.group({
      password_upload: ['', Validators.required],
      confirm_password_upload: ['', Validators.required],
    });
  }

  get edit_password_upload_controls(): { [key: string]: AbstractControl } {
    return this.editPasswordUploadForm.controls;
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  closeModals() {
    this.modalService.dismissAll();
  }

  onChangePasswordUpload(){
    this.submitted = true;
    if (this.editPasswordUploadForm.invalid) {
      return;
    }
  }
}
