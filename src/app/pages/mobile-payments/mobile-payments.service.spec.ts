import { TestBed } from '@angular/core/testing';

import { MobilePaymentsService } from './mobile-payments.service';

describe('MobilePaymentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MobilePaymentsService = TestBed.get(MobilePaymentsService);
    expect(service).toBeTruthy();
  });
});
