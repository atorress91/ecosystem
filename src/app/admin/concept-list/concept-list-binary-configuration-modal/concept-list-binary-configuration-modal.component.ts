import { Component, ViewChild, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-concept-list-binary-configuration-modal',
  templateUrl: './concept-list-binary-configuration-modal.component.html',
  styleUrls: ['./concept-list.scss'],
})
export class ConceptListBinaryConfigurationModalComponent implements OnInit {
  //configBinaryForm: FormGroup;
  submitted = false;
  title = 'angular13bestcode';

  @ViewChild('configBinaryModal') configBinaryModal: NgbModal;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {}
}
