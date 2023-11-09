import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesAndProductsComponent } from './services-and-products.component';

describe('ServicesAndProductsComponent', () => {
  let component: ServicesAndProductsComponent;
  let fixture: ComponentFixture<ServicesAndProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesAndProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesAndProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
