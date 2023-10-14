import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePurchaseModalComponent } from './make-purchase-modal.component';

describe('MakePurchaseModalComponent', () => {
  let component: MakePurchaseModalComponent;
  let fixture: ComponentFixture<MakePurchaseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakePurchaseModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakePurchaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
