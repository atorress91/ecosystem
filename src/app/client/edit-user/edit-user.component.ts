import { ClipboardService } from 'ngx-clipboard';
import { FaceApiService } from '@app/core/service/face-api-service/face-api.service';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Country } from '@app/core/models/country-model/country.model';
import { UpdateImageIdPath } from '@app/core/models/user-affiliate-model/update-image-id-path.model';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit, OnDestroy {
  public user: UserAffiliate = new UserAffiliate();
  public userCookie: UserAffiliate;
  updateImageIdPath: UpdateImageIdPath = new UpdateImageIdPath();
  private ngUnsubscribe = new Subject<void>();
  updateUserForm: FormGroup;
  listcountry: Country[] = [];
  loadingIndicator = true;
  reorderable = true;
  active = 1;
  files: File[] = [];
  uploadTask: any;
  fileRef: any;
  private isUploadCompleted = false;
  progress = 0;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private authService: AuthService,
    private affiliateService: AffiliateService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private faceApiService: FaceApiService,
    private clipboardService: ClipboardService
  ) {
  }

  @ViewChild('table') table: DatatableComponent;

  ngOnInit(): void {
    this.faceApiService.getFunctionUpload()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.startUpload();
      });


    this.userValidations();
    this.fetchCountry();
    this.getUserInfo();

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  userValidations() {
    this.updateUserForm = this.formBuilder.group({
      identification: ['', Validators.required],
      user_name: new FormControl({ value: '', disabled: true }),
      name: new FormControl({ value: '', disabled: true }),
      last_name: new FormControl({ value: '', disabled: true }),
      email: new FormControl({ value: '', disabled: true }),
      father: new FormControl({ value: '', disabled: true }),
      phone: ['', Validators.required],
      address: [],
      country: [],
      tax_id: [],
      zip_code: [],
      created_at: new FormControl({ value: '', disabled: true }),
      birthday: [],
      beneficiary_name: [],
      legal_authorized_first: [],
      legal_authorized_second: [],
      side: []
    });
  }

  setValues(affiliate: UserAffiliate) {
    this.updateUserForm.setValue({
      identification: affiliate.identification,
      user_name: affiliate.user_name,
      name: affiliate.name,
      last_name: affiliate.last_name,
      email: affiliate.email,
      side: affiliate.binary_matrix_side.toString() ?? 0,
      father: affiliate.father_user ? affiliate.father_user.user_name ?? '' : '',
      phone: affiliate.phone,
      address: affiliate.address ?? '',
      tax_id: affiliate.tax_id ?? '',
      country: affiliate.country,
      zip_code: affiliate.zip_code,
      created_at: affiliate.created_at,
      birthday: affiliate.birthday,
      beneficiary_name: affiliate.beneficiary_name ?? '',
      legal_authorized_first: affiliate.legal_authorized_first ?? '',
      legal_authorized_second: affiliate.legal_authorized_second ?? '',
    });
  }

  getUserInfo() {
    this.userCookie = this.authService.currentUserAffiliateValue;
    this.affiliateService.getAffiliateById(this.userCookie.id).subscribe((response) => {
      if (response.success) {
        this.user = response.data;
        this.setValues(this.user);
      }
    });
  }

  private fetchCountry() {
    this.affiliateService.getCountries().subscribe((data) => {
      this.listcountry = data;
    });
  }


  onSelect(event) {
    if (this.files.length === 0) {
      this.files.push(...event.addedFiles);
    }
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onSaveUser() {
    let userUpdate = new UserAffiliate();

    userUpdate.identification = this.updateUserForm.value.identification;
    userUpdate.phone = this.updateUserForm.value.phone;
    userUpdate.binary_matrix_side = this.updateUserForm.value.side;
    userUpdate.address = this.updateUserForm.value.address;
    userUpdate.zip_code = this.updateUserForm.value.zip_code;
    userUpdate.country = this.updateUserForm.value.country;
    userUpdate.birthday = this.updateUserForm.value.birthday;
    userUpdate.tax_id = this.updateUserForm.value.tax_id;
    userUpdate.beneficiary_name = this.updateUserForm.value.beneficiary_name;
    userUpdate.legal_authorized_first = this.updateUserForm.value.legal_authorize_first;
    userUpdate.legal_authorized_second = this.updateUserForm.value.legal_authorize_second;
    userUpdate.id = this.user.id;
    this.affiliateService.updateUserProfile(userUpdate).subscribe((response: UserAffiliate) => {
      if (response !== null) {
        this.showSuccess('The credentials is valid!');
        this.setValues(response);
      }
      else {
        this.showError('Error!');
      }
    });
  }

  onFileSelected(event: any): void {
    const files: File[] = Array.from(event.addedFiles);
    if (this.files.length + files.length <= 2) {
      this.files.push(...files);
      if (this.files.length == 2) {
        this.faceApiService.verifyImagesWithSsdMobilenetv1(this.files)
          .then(result => {
            if (result) {
              this.updateCardIdAuthorization(1);
              this.user.card_id_authorization = true;
              this.authService.setUserAffiliateValue(this.user);
            } else {
              this.updateCardIdAuthorization(0);
            }
          });
      }
    } else {
      this.showError('Error!');
      this.updateCardIdAuthorization(0);
    }

    const filePath = 'affiliates/' + `${this.user.user_name}/` + `${this.user.id}`;
    this.fileRef = ref(this.storage, filePath);
  }

  private updateProgress(snapshot): void {
    this.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log(`Upload is ${this.progress}% done`);
  }

  private handleError(error): void {
    console.error('Upload failed:', error);
    this.toastr.error('Upload failed');
  }

  private handleComplete(): void {
    getDownloadURL(this.uploadTask.snapshot.ref)
      .then(downloadURL => this.updateAffiliateImage(downloadURL))
      .catch(err => this.handleUpdateError(err));
  }

  private async updateAffiliateImage(downloadURL: string): Promise<void> {
    console.log('File available at:', downloadURL);
    this.updateImageIdPath.image_id_path = downloadURL;
    this.updateImageIdPath.id = this.user.id;

    try {
      await this.affiliateService.updateImageIdPath(this.updateImageIdPath).toPromise();
      this.handleUpdateSuccess();
    } catch (err) {
      this.handleUpdateError(err);
    }
  }

  private handleUpdateSuccess(): void {
    if (!this.isUploadCompleted) {
      console.log('Image updated successfully');
      this.toastr.success('Image updated successfully');
      this.faceApiService.startUploadFuntion();
      this.files = [];
      this.getUserInfo();
      this.isUploadCompleted = true;
    }
  }

  private handleUpdateError(err): void {
    console.error('Error updating affiliate image:', err);
    this.toastr.error('Error updating affiliate image');
  }

  startUpload(): void {
    this.isUploadCompleted = false;
    this.uploadTask = uploadBytesResumable(this.fileRef, this.files[0]);

    this.uploadTask.on('state_changed',
      snapshot => this.updateProgress(snapshot),
      error => this.handleError(error),
      () => this.handleComplete()
    );
  }

  deleteImage() {
    const filePath = 'affiliates/' + `${this.user.user_name}/` + `${this.user.id}`;
    this.user.image_id_path = '';
    this.updateImageIdPath.id = this.user.id;
    this.updateImageIdPath.image_id_path = this.user.image_id_path;
    this.affiliateService.updateImageIdPath(this.updateImageIdPath).subscribe({
      next: () => {
        this.showSuccess('Image deleted successfully');
        this.files = [];
      },
      error: () => {
        this.toastr.error('error');

      },
    })
  }

  deleteFile(index: number): void {
    if (this.files.length > 0 && index < this.files.length) {
      this.files.splice(index, 1);
    }
  }

  updateCardIdAuthorization(option: number) {
    this.affiliateService.updateCardIdAuthorization(this.user.id, option).subscribe({
      next: (value) => {
        if (value.card_id_authorization) {
          this.showSuccess('Afiliado verificado correctamente');
        } else {
          this.showError('Su verificación se encuentra pendiente')
        }
      },
      error: (err) => {
        this.showError('No se pudo verificar el afiliado')
      },
    })
  }
}
