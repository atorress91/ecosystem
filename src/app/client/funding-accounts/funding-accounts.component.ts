import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-funding-accounts',
  templateUrl: './funding-accounts.component.html',
  styleUrls: ['./funding-accounts.component.scss']
})
export class FundingAccountsComponent implements OnInit {
  active;

  constructor() {
  }

  ngOnInit(): void {
  }

  onTabChange(newActive: number) {
    this.active = newActive;
  }
}
