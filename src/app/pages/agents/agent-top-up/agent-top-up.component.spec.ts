import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentTopUpComponent } from './agent-top-up.component';

describe('AgentTopUpComponent', () => {
  let component: AgentTopUpComponent;
  let fixture: ComponentFixture<AgentTopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentTopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentTopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
