import { ImageProfileService } from './../../core/service/image-profile-service/image-profile.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { UpdateImageProfile } from '@app/core/models/user-affiliate-model/update-image-profile.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-img-profile',
  templateUrl: './img-profile.component.html',
  styleUrls: ['./img-profile.component.sass']
})
export class ImgProfileComponent implements OnInit {
  @ViewChild('profileImgModal', { static: true }) private modalContent: TemplateRef<any>;
  file: File | null = null;
  fileRef: any;
  user: UserAffiliate = new UserAffiliate();

  constructor(private modalService: NgbModal,
    private storage: Storage,
    private authService: AuthService,
    private affiliateService: AffiliateService,
    private toastr: ToastrService,
    private imageProfileService: ImageProfileService) {
  }

  ngOnInit(): void {
    this.user = this.authService.currentUserAffiliateValue;
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.showError(message);
  }

  openProfileImgModal() {
    this.modalService.open(this.modalContent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      centered: true,
    });
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
