import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinpaymentsComponent } from './coinpayments.component';

describe('CoinpaymentsComponent', () => {
  let component: CoinpaymentsComponent;
  let fixture: ComponentFixture<CoinpaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinpaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinpaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
