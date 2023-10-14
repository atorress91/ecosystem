import { Component, ViewChild, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { UpdatePassword } from '@app/core/models/user-model/update.password.model';

@Component({
  selector: 'app-my-profile-edit-password-upload-modal',
  templateUrl: './my-profile-edit-password-upload-modal.component.html',
})
export class MyProfileEditPasswordUploadModalComponent implements OnInit {
  editPasswordUploadForm: FormGroup;
  submitted = false;
  public userId: number;
  public credentials: UpdatePassword = new UpdatePassword();

  @ViewChild('editPasswordUploadModal') editPasswordUploadModal: NgbModal;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private affiliateService: AffiliateService
  ) {}

  ngOnInit(): void {
    this.loadValidations();
  }

  onChangePasswordUpload() {
    this.submitted = true;
    if (this.editPasswordUploadForm.invalid) {
      return;
    }

    this.credentials.password = this.editPasswordUploadForm.value.currentPassword;
    this.credentials.new_password = this.editPasswordUploadForm.value.pin;
    this.credentials.confirm_password = this.editPasswordUploadForm.value.confirmPin;
    this.credentials.id = this.userId;

    this.affiliateService.updatePin(this.credentials).subscribe((response) => {
      if (response.success) {
        this.showSuccess('The security pin has been successfully updated!');
        this.closeModals();
      }
      else {
        this.showError('The security pin is not correct!');
      }
    });
  }

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  loadValidations() {
    this.editPasswordUploadForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      pin: ['', Validators.required],
      confirmPin: ['', Validators.required],
    },
    {
      validator: passwordMatchValidator
    });
  }

  openEditPasswordUploadModal(content, user: UserAffiliate) {
    this.submitted = false;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });

    this.editPasswordUploadForm.setValue({
      currentPassword: '',
      pin: '',
      confirmPin: '',
    });
    this.userId = user.id;
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

}

export function passwordMatchValidator(formGroup: FormGroup) {
  const password = formGroup.get('pin').value;
  const confirmPassword = formGroup.get('confirmPin').value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
