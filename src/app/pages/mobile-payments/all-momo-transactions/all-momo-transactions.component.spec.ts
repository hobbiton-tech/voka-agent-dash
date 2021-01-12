import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMomoTransactionsComponent } from './all-momo-transactions.component';

describe('AllMomoTransactionsComponent', () => {
  let component: AllMomoTransactionsComponent;
  let fixture: ComponentFixture<AllMomoTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllMomoTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMomoTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
