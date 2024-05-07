import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsPlansOneBComponent } from './savings-plans-one-b.component';

describe('SavingsPlansOneBComponent', () => {
  let component: SavingsPlansOneBComponent;
  let fixture: ComponentFixture<SavingsPlansOneBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingsPlansOneBComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsPlansOneBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
