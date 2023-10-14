import { ConceptConfigurationService } from '@app/core/service/concept-configuration-service/concept-configuration.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConceptLevel } from '@app/core/models/concept-configuration-model/concept-level.model';
import { ConceptList } from '@app/core/models/concept-model/concept-list.model';
import { GradingService } from '@app/core/service/grading-service/grading.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-concept-list-configuration-modal',
  templateUrl: './concept-list-configuration-modal.component.html',
})
export class ConceptListConfigurationModalComponent implements OnInit {
  // conceptConfigurationForm!: FormGroup;
  submitted = false;
  dataObject: ConceptLevel[] = [];
  conceptLevel: ConceptLevel = new ConceptLevel();
  concept: ConceptList = new ConceptList();
  calificationList!: [];

  @ViewChild('configurationModal') configurationModal: NgbModal;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private gradingService: GradingService,
    private conceptConfigurationService: ConceptConfigurationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchCalificationList();
  }

  addForm() {
    this.conceptLevel = new ConceptLevel();
    this.dataObject.push(this.conceptLevel);
    this.dataObject.forEach((resp, index) => {});
  }

  removeForm(index) {
    this.dataObject.splice(index, 1);
  }

  configurationOpenModal(content, value) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    this.concept = value;
    this.conceptConfigurationService
      .getConceptConfigurationByConceptId(this.concept.id)
      .subscribe((resp) => {
        if (resp !== null) {
          this.dataObject = resp;
        }
      });
  }

  showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  onAddRowSave(conceptLevel: ConceptLevel) {
    conceptLevel.conceptId = this.concept.id;
    if (conceptLevel.id === 0) {
      this.conceptConfigurationService
        .createConceptLevel(conceptLevel)
        .subscribe((resp) => {
          this.showSuccess('The concept level was created successfully!');
          this.loadConceptConfiguration();
        });
    } else {
      this.conceptConfigurationService
        .updateConceptLevel(conceptLevel)
        .subscribe((resp) => {
          if (resp.success)
            this.showSuccess('The concept level was update successfully!');
        });
    }
  }

  fetchCalificationList() {
    this.gradingService.getAll().subscribe((resp) => {
      if (resp !== null) {
        this.calificationList = resp;
      }
    });
  }

  deleteSingleRow(value, indexRow) {
    Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonColor: '#8963ff',
      cancelButtonColor: '#fb7823',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.deleteRecord(value, indexRow);
      }
    });
  }

  deleteRecord(value, indexRow) {
    if (value.id !== 0) {
      this.conceptConfigurationService.delete(value.id).subscribe((resp) => {
        if (resp.success) {
          this.deleteRecordSuccess(1);
          this.loadConceptConfiguration();
        }
      });
    } else {
      this.dataObject.splice(indexRow, 1);
    }
  }

  deleteRecordSuccess(count) {
    this.toastr.success(count + ' Records Deleted Successfully', '');
  }

  loadConceptConfiguration() {
    this.conceptConfigurationService
      .getConceptConfigurationByConceptId(this.concept.id)
      .subscribe((resp) => {
        if (resp !== null) {
          this.dataObject = resp;
        }
      });
  }
}
