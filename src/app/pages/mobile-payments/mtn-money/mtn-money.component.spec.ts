import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnMoneyComponent } from './mtn-money.component';

describe('MtnMoneyComponent', () => {
  let component: MtnMoneyComponent;
  let fixture: ComponentFixture<MtnMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnMoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
