import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZamtelKwachaComponent } from './zamtel-kwacha.component';

describe('ZamtelKwachaComponent', () => {
  let component: ZamtelKwachaComponent;
  let fixture: ComponentFixture<ZamtelKwachaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZamtelKwachaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZamtelKwachaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
