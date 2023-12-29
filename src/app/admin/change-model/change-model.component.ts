import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-change-model',
  templateUrl: './change-model.component.html',
  styleUrls: ['./change-model.component.css']
})
export class ChangeModelComponent implements OnInit {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor() { }

  ngOnInit() {
    this.loadingIndicator = false;
  }

  onPrint() {
    throw new Error('Method not implemented.');
  }

  clipBoardCopy() {
    throw new Error('Method not implemented.');
  }

  updateFilter($event: any) {
    throw new Error('Method not implemented.');
  }
}
