import { Response } from './../../../core/models/response-model/response.model';
import { map } from 'rxjs/operators';
import {
  Component,
  ViewChild,
  HostListener,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  DatatableComponent,
  SelectionType,
  ColumnMode,
} from '@swimlane/ngx-datatable';

import { Rol } from '@app/core/models/rol-model/rol.model';
import { PrivilegeService } from '@app/core/service/privilege-service/privilege.service';
import { MenuConfiguration } from '@app/core/models/menu-configuration-model/menu.configuration.model';
import { Privilege } from '@app/core/models/privilege-model/privilege.model';

@Component({
  selector: 'app-rol-list-permissions-modal',
  templateUrl: './rol-list-permissions-modal.component.html',
  providers: [ToastrService],
})
export class RolListPermissionsModalComponent implements OnInit {
  public idRole: number;
  title: string = '';
  rol = new Rol();
  rows = [];
  temp = [];

  SelectionType = SelectionType;
  selectedRows: selectRowInterface;
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  public selected: MenuConfiguration[] = [];

  @ViewChild('table') table: DatatableComponent;
  @ViewChild('permissionsCreateModal') permissionsCreateModal: NgbModal;

  constructor(
    private modalService: NgbModal,
    private privilegeService: PrivilegeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

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

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  loadPermissionsList(rolId: number) {
    this.privilegeService.getMenuConfigurations(rolId).subscribe({
      next: (menuConfiguration: MenuConfiguration[]) => {
        this.temp = [...menuConfiguration];
        this.rows = menuConfiguration;
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 500);
      },
      error: (err) => {
        this.showError('Error!' + err);
      },
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    if (this.temp && this.table) {
      const temp = this.temp.filter((d) => {
        return d.name?.toLowerCase().indexOf(val) !== -1 || !val;
      });
      this.rows = temp;
      this.table.offset = 0;
    }
  }

  updateOrcreatePrivilege(menu: MenuConfiguration) {
    let privilege = new Privilege();
    privilege.menu_configuration_id = menu.menu_configuration_id;
    privilege.rol_id = this.idRole;
    privilege.can_create = menu.can_create;
    privilege.can_edit = menu.can_edit;
    privilege.can_delete = menu.can_delete;
    privilege.can_read = menu.can_read;

    if (menu.privilege_id === null) {
      this.privilegeService.createPrivilege(privilege).subscribe({
        next: (value) => {
          this.loadPermissionsList(privilege.rol_id);
        },
        error: (err) => {
          this.showError('Error!' + err);
        },
      });
    } else {
      privilege.id = menu.privilege_id;

      this.privilegeService.updatePrivilege(privilege).subscribe({
        next: (value) => {
          this.loadPermissionsList(privilege.rol_id);
        },
        error: (err) => {
          this.showError('Error!' + err);
        },
      });
    }
  }

  permissionsOpenModal(content, rol: Rol) {
    this.loadPermissionsList(rol.id);
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.title = rol.name;
    this.idRole = rol.id;
  }

  closeModals() {
    this.modalService.dismissAll();
  }
}

export interface selectRowInterface {
  menuName: String;
  subMenuName: String;
  read: String;
  edit: String;
  create: String;
  delete: String;
}
