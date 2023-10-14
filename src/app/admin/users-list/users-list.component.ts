import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ClipboardService } from 'ngx-clipboard';

import { UserService } from '@app/core/service/user-service/user.service';
import { User } from '@app/core/models/user-model/user.model';
import { PrintService } from '@app/core/service/print-service/print.service';
import { RolService } from '@app/core/service/rol-service/rol.service';
import { Rol } from '@app/core/models/rol-model/rol.model';

const header = ['Usuario', 'Rol', 'Nombre', 'Apellido', 'Correo'];

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  providers: [ToastrService],
})
export class UsersListComponent implements OnInit {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  user: User;
  items: any = [];

  @ViewChild('table') table: DatatableComponent;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private clipboardService: ClipboardService,
    private printService: PrintService,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.onFillDropdownRol();
    this.loadUserList();
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }

  getRowHeight(row) {
    return row.height;
  }

  loadUserList() {
    this.userService.getAll().subscribe({
      next: (value: User[]) => {
        this.temp = [...value];
        this.rows = value;
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 500);
      },
      error: (err) => {
        this.showError('Error!' + err);
      },
    });
  }

  createOpenModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  closeModals() {
    this.modalService.dismissAll();
  }

  onFillDropdownRol() {
    this.rolService.getAll().subscribe({
      next: (roles: Rol[]) => {
        for (const result of roles) {
          this.items.push(result);
        }
      },
      error: (err) => {
        this.showError('Error!' + err);
      },
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  deleteSingleRow(value) {
    Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonColor: '#8963ff',
      cancelButtonColor: '#fb7823',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.deleteRecord(value);
      }
    });
  }

  deleteRecord(value) {
    this.userService.deleteUser(value).subscribe({
      next: (resp) => {
        this.deleteRecordSuccess(1);
        this.loadUserList();
      },
      error: (err) => {
        this.showError('Error!' + err);
      },
    });
  }

  deleteRecordSuccess(count) {
    this.toastr.success(count + ' Records Deleted Successfully', '');
  }

  clipBoardCopy() {
    var string = JSON.stringify(this.temp);
    var result = this.clipboardService.copyFromContent(string);

    if (this.temp.length === 0) {
      this.toastr.info('No data to copy');
    } else {
      this.toastr.success('Copied ' + this.temp.length + ' rows successfully');
    }
  }

  onPrint() {
    const body = this.temp.map((items: any) => {
      const data = [
        items.user_name,
        items.rol_name,
        items.name,
        items.last_name,
        items.email,
      ];
      return data;
    });

    this.printService.print(header, body, 'Lista de Usuarios', false);
  }
}
