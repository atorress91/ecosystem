import { UserService } from '@app/core/service/user-service/user.service';
import { Component, ViewChild, HostListener } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Rol } from '@app/core/models/rol-model/rol.model';
import { User } from '@app/core/models/user-model/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rol-list-summary-modal',
  templateUrl: './rol-list-summary-modal.component.html',
})
export class RolListSummaryModalComponent {
  rolData = new Rol();
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;
  @ViewChild('rolDetailModal') rolDetailModal: NgbModal;
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  summaryOpenModal(content, rol: Rol) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    let user = new User();
    this.rolData.name = rol.name;
    this.rolData.description = rol.description;
    user.rol_id = rol.id;
    this.getUsersByRolId(user);
  }

  getUsersByRolId(user: User) {
    this.userService.getUsersByRolId(user).subscribe({
      next: (result: User[]) => {
        this.temp = [...result];
        this.rows = result;
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 500);
      },
      error: (err) => {
        this.showError('Error!' + err);
      },
    });
  }

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  closeModals() {
    this.modalService.dismissAll();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    if (this.table) {
      this.table.recalculate();
      this.table.recalculateColumns();
    }
  }

  getRowHeight(row) {
    return row.height;
  }
}
