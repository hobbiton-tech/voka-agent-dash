import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelTransactionsComponent } from './airtel-transactions.component';

describe('AirtelTransactionsComponent', () => {
  let component: AirtelTransactionsComponent;
  let fixture: ComponentFixture<AirtelTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
