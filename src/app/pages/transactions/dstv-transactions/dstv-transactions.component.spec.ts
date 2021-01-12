import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DstvTransactionsComponent } from './dstv-transactions.component';

describe('DstvTransactionsComponent', () => {
  let component: DstvTransactionsComponent;
  let fixture: ComponentFixture<DstvTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DstvTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DstvTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
