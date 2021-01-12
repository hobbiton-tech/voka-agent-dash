import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GotvTransactionsComponent } from './gotv-transactions.component';

describe('GotvTransactionsComponent', () => {
  let component: GotvTransactionsComponent;
  let fixture: ComponentFixture<GotvTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GotvTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GotvTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
