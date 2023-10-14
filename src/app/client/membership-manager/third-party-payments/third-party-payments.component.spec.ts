import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPartyPaymentsComponent } from './third-party-payments.component';

describe('ThirdPartyPaymentsComponent', () => {
  let component: ThirdPartyPaymentsComponent;
  let fixture: ComponentFixture<ThirdPartyPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirdPartyPaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdPartyPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
