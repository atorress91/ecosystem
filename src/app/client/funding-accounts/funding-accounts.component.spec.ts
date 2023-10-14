import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingAccountsComponent } from './funding-accounts.component';

describe('FundingAccountsComponent', () => {
  let component: FundingAccountsComponent;
  let fixture: ComponentFixture<FundingAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundingAccountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundingAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
