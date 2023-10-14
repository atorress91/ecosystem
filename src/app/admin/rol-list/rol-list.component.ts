import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import {
  DatatableComponent,
  ColumnMode,
  SelectionType,
} from '@swimlane/ngx-datatable';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';

import { RolService } from '@app/core/service/rol-service/rol.service';
import { Rol } from '@app/core/models/rol-model/rol.model';
import { PrintService } from '@app/core/service/print-service/print.service';
import { User } from '@app/core/models/user-model/user.model';
import { UserService } from '@app/core/service/user-service/user.service';
import { PrivilegeService } from '@app/core/service/privilege-service/privilege.service';

const header = ['Id', 'Rol', 'Descripción', 'Usuarios Asociados', 'Permisos'];

@Component({
  selector: 'app-rol-list',
  templateUrl: './rol-list.component.html',
  providers: [ToastrService],
})
export class RolListComponent implements OnInit {
  countUsers = [];
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  selected = [];
  columns: any[] = [{ prop: 'name' }, { name: 'Company' }, { name: 'Gender' }];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  createRolForm: FormGroup;
  updateRolForm: FormGroup;
  submitted = false;
  rolGlobal: Rol = new Rol();

  @ViewChild('table') table: DatatableComponent;

  constructor(
    private modalService: NgbModal,
    private rolService: RolService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private clipboardService: ClipboardService,
    private printService: PrintService,
    private privilegeService: PrivilegeService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadRolList();
    this.loadValidations();
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  loadValidations() {
    this.createRolForm = this.formBuilder.group({
      rol_name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    if (this.table) {
      this.table.recalculate();
      this.table.recalculateColumns();
    }
  }

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  getRowHeight(row) {
    return row.height;
  }

  loadRolList() {
    this.rolService.getAll().subscribe({
      next: (roles: Rol[]) => {
        this.temp = [...roles];
        this.rows = roles;
        setTimeout(() => {
          this.loadingIndicator = false;
        }, 500);
      },
      error: (err) => {
        this.showError('Error!' + err);
      },
    });
  }

  permissionsOpenModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  createOpenModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  updateOpenModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  closeModals() {
    this.modalService.dismissAll();
  }

  onAddRowSave() {
    this.submitted = true;
    if (this.createRolForm.invalid) {
      return;
    }
    let rol = new Rol();
    rol.name = this.createRolForm.value.rol_name;
    rol.description = this.createRolForm.value.description;

    this.rolService.createRol(rol).subscribe({
      next: (value) => {
        this.showSuccess('The rol was created successfully!');
        this.closeModals();
        this.loadRolList();
      },
      error: (err) => {
        this.showError('Error!' + err);
      },
    });
  }

  get create_rol_controls(): { [key: string]: AbstractControl } {
    return this.createRolForm.controls;
  }

  onReset() {
    this.submitted = false;
    this.createRolForm.reset();
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
    this.rolService.deleteRol(value).subscribe({
      next: (value) => {
        this.deleteRecordSuccess(1);
        this.loadRolList();
      },
      error: (err) => {
        this.showError('Error!' + err);
      },
    });
  }

  deleteRecordSuccess(count) {
    this.toastr.success(count + ' Records Deleted Successfully', '');
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  clipBoardCopy() {
    var string = JSON.stringify(this.temp);
    var result = this.clipboardService.copyFromContent(string);

    if (this.temp.length === 0) {
      this.toastr.info('no data to copy');
    } else {
      this.toastr.success('copied ' + this.temp.length + ' rows successfully');
    }
  }

  onPrint() {
    const body = this.temp.map((items: any) => {
      const data = [
        items.id,
        items.name,
        items.description,
        items.associated_users,
        items.permissions,
      ];
      return data;
    });

    this.printService.print(header, body, 'Lista de Roles', false);
  }

  onCountPermissions() {
    this.privilegeService.getAllPrivileges().subscribe((result) => {});
  }
}
