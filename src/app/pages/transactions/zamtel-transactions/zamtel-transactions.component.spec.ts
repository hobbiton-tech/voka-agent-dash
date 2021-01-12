import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZamtelTransactionsComponent } from './zamtel-transactions.component';

describe('ZamtelTransactionsComponent', () => {
  let component: ZamtelTransactionsComponent;
  let fixture: ComponentFixture<ZamtelTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZamtelTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZamtelTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
