import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinpaycrComponent } from './coinpaycr.component';

describe('CoinpaycrComponent', () => {
  let component: CoinpaycrComponent;
  let fixture: ComponentFixture<CoinpaycrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinpaycrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinpaycrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
