import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentTransactionsComponent } from './agent-transactions.component';

describe('AgentTransactionsComponent', () => {
  let component: AgentTransactionsComponent;
  let fixture: ComponentFixture<AgentTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
