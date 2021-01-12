import { TestBed } from '@angular/core/testing';

import { AgentSalesReportsService } from './agent-sales-reports.service';

describe('AgentSalesReportsService', () => {
  let service: AgentSalesReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentSalesReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
