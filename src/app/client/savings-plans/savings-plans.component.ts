import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-savings-plans',
  templateUrl: './savings-plans.component.html',
  styleUrls: ['./savings-plans.component.css']
})
export class SavingsPlansComponent implements OnInit {
  active: number = 5;

  constructor() { }

  ngOnInit() {
  }
}
