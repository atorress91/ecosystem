import { LoginMovements } from './../../core/models/signin-model/login-movements.model';
import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { PrintService } from '@app/core/service/print-service/print.service';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { GradingService } from '@app/core/service/grading-service/grading.service';

import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { Grading } from '@app/core/models/grading-model/grading.model';
import { error } from 'console';

const header = ['Movimientos', 'IP', 'Fecha'];

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
})
export class MyProfileComponent implements OnInit {
  public user: UserAffiliate = new UserAffiliate();
  public grading: Grading = new Grading();
  public userCookie: UserAffiliate;
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  constructor(
    private modalService: NgbModal,
    private printService: PrintService,
    private clipboardService: ClipboardService,
    private toastr: ToastrService,
    private authService: AuthService,
    private gradingService: GradingService,
    private affiliateService: AffiliateService,

  ) { }

  @ViewChild('table') table: DatatableComponent;

  ngOnInit(): void {
    this.getUserInfo();
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

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  getUserInfo() {
    this.userCookie = this.authService.currentUserAffiliateValue;
    this.affiliateService.getAffiliateById(this.userCookie.id).subscribe((response) => {
      if (response.success) {
        this.user = response.data;
        this.getGradingInfo(this.user.external_grading_before_id);
        this.loadLoginMovements();
      }
    });
  }

  getGradingInfo(id: number) {
    this.gradingService.getGradingById(id).subscribe((response) => {
      if (response.success) {
        this.grading = response.data;
      }
    });
  }

  onPrintPdf() {
    const body = this.temp.map((items: any) => {
      const data = [items.movements, items.ip, items.date];
      return data;
    });

    this.printService.print(header, body, 'Últimos Movimientos', false);
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

  loadLoginMovements() {
    this.authService.getLoginMovementsByAffiliatedId(this.user.id).subscribe({
      next: (response: LoginMovements[]) => {
        console.log(response);
        if (response !== null) {
          this.temp = response;
          this.rows = [...response];
        }
        this.loadingIndicator = false;
      },
      error: (error) => {
        this.toastr.error('Error loading movements');
        this.loadingIndicator = false;
      }
    });
  }
}
