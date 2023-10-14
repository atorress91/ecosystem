import { EventEmitter } from '@angular/core';
import { Component, ViewChild, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { RolService } from '@app/core/service/rol-service/rol.service';
import { Rol } from '@app/core/models/rol-model/rol.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rol-list-edit-modal',
  templateUrl: './rol-list-edit-modal.component.html',
  providers: [ToastrService],
})
export class RolListEditModalComponent implements OnInit {
  rol = new Rol();
  updateRolForm: FormGroup;
  submitted = false;
  rolGlobal: Rol = new Rol();
  @ViewChild('rolUpdateModal') rolUpdateModal: NgbModal;
  @Output('loadRolList') loadRolList: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private rolService: RolService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}
  get update_rol_controls(): { [key: string]: AbstractControl } {
    return this.updateRolForm.controls;
  }

  ngOnInit() {
    this.loadValidations();
  }
  loadValidations() {
    this.updateRolForm = this.formBuilder.group({
      rol_name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  updateOpenModal(content, rol: Rol) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    (this.rol = new Rol()), (this.rolGlobal = rol);
    this.updateRolForm.setValue({
      rol_name: rol.name,
      description: rol.description,
    });
  }

  showError(message) {
    this.toastr.error(message, 'Error!');
  }

  updateRol() {
    this.submitted = true;
    if (this.updateRolForm.invalid) {
      return;
    }
    this.rolGlobal.name = this.updateRolForm.value.rol_name;
    this.rolGlobal.description = this.updateRolForm.value.description;

    this.rolService.updateRol(this.rolGlobal).subscribe({
      next: (value) => {
        this.showSuccess('The rol was update successfully!');
        this.closeModals();
        this.loadRolList.emit();
      },
      error: (err) => {
        this.showError('Error!' + err);
      },
    });
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  closeModals() {
    this.modalService.dismissAll();
  }
}
