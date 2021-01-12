import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LwscTransactionsComponent } from './lwsc-transactions.component';

describe('LwscTransactionsComponent', () => {
  let component: LwscTransactionsComponent;
  let fixture: ComponentFixture<LwscTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LwscTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LwscTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
