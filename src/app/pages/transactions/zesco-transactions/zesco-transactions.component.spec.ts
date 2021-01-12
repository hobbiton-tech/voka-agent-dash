import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZescoTransactionsComponent } from './zesco-transactions.component';

describe('ZescoTransactionsComponent', () => {
  let component: ZescoTransactionsComponent;
  let fixture: ComponentFixture<ZescoTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZescoTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZescoTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
