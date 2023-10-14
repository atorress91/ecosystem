import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import Swal from 'sweetalert2';

import { ToastrService } from 'ngx-toastr';
import { _ParseAST } from '@angular/compiler';

import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';

@Component({
  selector: 'app-authorize-affiliates-edit-modal',
  templateUrl: './authorize-affiliates-edit-modal.component.html',
  providers: [ToastrService],
})
export class AuthorizeAffiliatesEditModalComponent implements OnInit {
  user = new UserAffiliate();
  @ViewChild('authorizeAffiliateEditModal') authorizeAffiliateEditModal: NgbModal;
  @Output('loadAffiliateList') loadAffiliateList: EventEmitter<any> =
    new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private affiliateService: AffiliateService
  ) { }

  editOpenModal(content, affiliate: UserAffiliate) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    this.user = affiliate;
  }

  ngOnInit(): void {
  }

  sendEmail(){
    this.affiliateService
    .sendEmailConfirm(this.user.id)
    .subscribe((response) => {
      if (response.success) {
        this.showSuccess('The email was sent correctly.');
      } else {
        this.showError('Error!');
      }
    });
  }

  authorization(){
    Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonColor: '#8963ff',
      cancelButtonColor: '#fb7823',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        let approvedArray = [];
        approvedArray.push(this.user.id);
        this.selectionProcess(approvedArray, []);     
      }
    });

  }

  delete(){
    Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonColor: '#8963ff',
      cancelButtonColor: '#fb7823',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        let disApprovedArray = [];
        disApprovedArray.push(this.user.id);
        this.selectionProcess([], disApprovedArray);      
      }
    });
  }


  selectionProcess(approvedArray: any[], disApprovedArray: any[]) {
    this.affiliateService
    .authorizationAffiliates(approvedArray, disApprovedArray)
    .subscribe((response) => {
      if (response.success) {
        this.showSuccess('The affiliation have been processed successfully.');
        this.loadAffiliateList.emit();
        this.closeModals();
      } else {
        this.showError('Error!');
      }
    });
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  closeModals() {
    this.modalService.dismissAll();
  }
}
