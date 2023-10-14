import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

import { User } from '@app/core/models/user-model/user.model';

@Component({
  selector: 'app-users-list-detail-modal',
  templateUrl: './users-list-detail-modal.component.html',
  providers: [ToastrService],
})
export class UsersListDetailModalComponent {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  user: User = new User();
  detailUserForm: FormGroup;
  @ViewChild('userDetailModal') userDetailModal: NgbModal;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private clipboardService: ClipboardService
  ) {}

  detailOpenModal(content, user: User) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    this.user = user;
  }

  clipBoardCopy() {
    var string = JSON.stringify(this.temp);
    var result = this.clipboardService.copyFromContent(string);

    if (this.temp.length === 0) {
      this.toastr.info('No data to copy');
    } else {
      this.toastr.success('Copied ' + this.temp.length + 'rows succesfully');
    }
  }
}
