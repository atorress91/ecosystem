import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { User } from '@app/core/models/user-model/user.model';
import { UserService } from '@app/core/service/user-service/user.service';
import { PrintService } from '@app/core/service/print-service/print.service';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

const header = ['Movimientos', 'IP', 'Fecha'];

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
})
export class MyProfileComponent implements OnInit {
  public user: User = new User();
  public userCookie: User;
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private printService: PrintService,
    private clipboardService: ClipboardService,
    private toastr: ToastrService,
  ) {}

  @ViewChild('table') table: DatatableComponent;

  ngOnInit(): void {
    this.getCurrentUser();
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

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  getCurrentUser() {
    let result = localStorage.getItem('currentUserAdmin');
    let object = JSON.parse(result);
    this.userCookie = object;
  }

  getUserInfo() {
    this.userService.getUser(this.userCookie).subscribe((response) => {
      if (response.success) {
        this.user = response.data;
      }
    });
  }

  openEditPasswordUploadModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
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
}
