import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { UpdateImageProfile } from '@app/core/models/user-affiliate-model/update-image-profile.model';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { AuthService } from '@app/core/service/authentication-service/auth.service';

@Component({
  selector: 'app-image-profile-modal',
  templateUrl: './image-profile-modal.component.html',
})
export class ImageProfileModalComponent implements OnInit {
  public userId: number;
  @ViewChild('imageProfileModal') imageProfileModal: NgbModal;
  file: File | null = null;
  fileRef: any;
  user: UserAffiliate = new UserAffiliate();
  @Output() getInfo = new EventEmitter<void>();

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private affiliateService: AffiliateService,
    private storage: Storage,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserAffiliateValue
  }

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  openImageProfileModal(content, user: UserAffiliate) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true
    });

    this.userId = user.id;
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  closeModals() {
    this.modalService.dismissAll();
  }


  onFileSelected(event: any): void {

    this.file = event.addedFiles[0];

    const filePath = 'affiliates/profile/' + `${this.user.user_name}/` + `${this.user.id}`;
    this.fileRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(this.fileRef, this.file);

    uploadTask.on('state_changed',
      (snapshot) => {
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          let updateImage = new UpdateImageProfile();
          updateImage.image_profile_url = downloadURL;
          this.affiliateService.updateImageProfile(this.user.id, updateImage).subscribe({
            next: (value: UserAffiliate) => {
              if (value) {
                this.authService.setUserAffiliateValue(value);
                this.user.image_profile_url = value.image_profile_url;
                this.getInfo.emit();
                this.showSuccess('Imagen actualizada correctamente');
              }
            },
            error: () => {
              this.showError('No se pudo actualizar la imagen de perfil');
            },
          })
        });
      }
    );
  }

  removeImage(): void {
    let updateImage = new UpdateImageProfile();
    updateImage.image_profile_url = '';
    this.user.image_profile_url = null;
    this.file = null;

    this.affiliateService.updateImageProfile(this.user.id, updateImage).subscribe({
      next: (value) => {
        if (value) {
          this.getInfo.emit();
          this.showSuccess('Imagen eliminada correctamente');
          this.authService.setUserAffiliateValue(value);
        }
      },
      error: () => {
        this.showError('La imagen no se ha eliminado');
      },
    })
  }
}


