import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopstarTransactionsComponent } from './topstar-transactions.component';

describe('TopstarTransactionsComponent', () => {
  let component: TopstarTransactionsComponent;
  let fixture: ComponentFixture<TopstarTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopstarTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopstarTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
