import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnTransactionsComponent } from './mtn-transactions.component';

describe('MtnTransactionsComponent', () => {
  let component: MtnTransactionsComponent;
  let fixture: ComponentFixture<MtnTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
