import { Component, OnInit, ViewChild } from '@angular/core';
import { Incentive } from '@app/core/models/incentive-model/incentive.model';
import { GradingService } from '@app/core/service/grading-service/grading.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-incentives-list-details-modal',
  templateUrl: './incentives-list-details-modal.component.html',
})
export class IncentivesListDetailsModalComponent implements OnInit {
  incentive: Incentive = new Incentive();
  calificationList!: [];
  productListData!: [];
  membershipData!: [];
  active = 1;

  @ViewChild('incentiveDetailsModal') incentiveDetailsModal: NgbModal;

  constructor(
    private modalService: NgbModal,
    private gradingService: GradingService
  ) {}

  ngOnInit(): void {
    this.fetchCalificationList();
    this.fetchMembership();
    this.fetchProductList();
  }

  detailsOpenModal(content, incentive: Incentive) {
    this.incentive = incentive;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  fetchCalificationList() {
    this.gradingService.getAll().subscribe((resp) => {
      if (resp !== null) {
        this.calificationList = resp;
      }
    });
  }

  fetchProductList() {
    this.gradingService.getProductList().subscribe((resp) => {
      this.productListData = resp;
    });
  }

  fetchMembership() {
    this.gradingService.getMembership().subscribe((resp) => {
      this.membershipData = resp;
    });
  }
}
