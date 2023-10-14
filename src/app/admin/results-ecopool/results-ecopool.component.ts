import { ResultsEcoPool } from './../../core/models/results-ecopool-model/results-ecopool.model';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ResultsEcoPoolService } from '@app/core/service/results-ecopool-service/results-ecopool.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-results-ecopool',
  templateUrl: './results-ecopool.component.html'
})
export class ResultsEcopoolComponent implements OnInit {
  temp = [];
  rows = [];
  expanded: any = {};
  timeout: any;
  resultsEcoPool: ResultsEcoPool;
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor(private resultsEcoPoolService: ResultsEcoPoolService) {

  }

  ngOnInit(): void {
    this.loadResults();
  }

  ngAfterViewInit() {
    this.onResize(event);
    window.addEventListener('resize', this.onResize.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }


  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return d.affiliateName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
    this.table.offset = 0;
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  getRowHeight(row) {
    return row.height;
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  loadResults() {
    this.resultsEcoPoolService.getAllResultsEcoPool().subscribe({
      next: (value) => {
        this.temp = [...value];
        this.rows = value;
        this.loadingIndicator = false;
      },
      error: (err) => {

      },
    })
  }
}
