import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelMoneyComponent } from './airtel-money.component';

describe('AirtelMoneyComponent', () => {
  let component: AirtelMoneyComponent;
  let fixture: ComponentFixture<AirtelMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelMoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
