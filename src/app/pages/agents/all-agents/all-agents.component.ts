import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  OnDestroy,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable, Subject } from 'rxjs';
import { Agent, Partner } from '../agents.model';
import {
  SharedSortableDirective,
  SortEvent,
} from '../../../shared/directives/shared-sortable.directive';
import { AgentsService } from '../agents.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentDetailsComponent } from '../agent-details/agent-details.component';
import { NewAgentComponent } from '../new-agent/new-agent.component';
import { AgentTopUpComponent } from '../agent-top-up/agent-top-up.component';
import { ToastService } from '../../../shared/services/toast.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-agents',
  templateUrl: './all-agents.component.html',
  styleUrls: ['./all-agents.component.scss'],
  providers: [AgentsService, DecimalPipe],
})
export class AllAgentsComponent implements OnInit, OnDestroy {
  // Bread crumb data
  breadCrumbItems: Array<{}>;
  private unsubscribe$: Subject<void> = new Subject<void>();
  agents$: Agent[];
  Agents$: Partner[];
  total$: number;
  empty$: boolean;

  @ViewChildren(SharedSortableDirective) headers: QueryList<
    SharedSortableDirective
  >;

  constructor(
    public agentsService: AgentsService,
    private modalService: NgbModal,
    public toastService: ToastService
  ) {}

  ngOnInit() {
    this.breadCrumbItems = [
      {
        label: 'Voka Admin',
        path: '/',
      },
      {
        label: 'Agents',
        path: '/',
      },
      {
        label: 'All Agents',
        path: '/',
        active: true,
      },
    ];

    /**
     * fetch data
     */
    this._fetchData();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  _fetchData(): void {
    this.agentsService._fetchAgents();

    // Subscriptions
    this.agentsService.agents$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((Agents) => (this.agents$ = Agents));
    this.agentsService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.total$ = total));
    this.agentsService.empty$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((empty) => (this.empty$ = empty));
    // this.agentsService._fetchAgents();
    console.log('Agents>>>', this.agents$)
    // // Subscriptions
    // this.agentsService.agents$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((agents) => (this.agents$ = agents));
    // this.agentsService.total$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((total) => (this.total$ = total));
    // this.agentsService.empty$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((empty) => (this.empty$ = empty));
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.agentsService.sortColumn = column;
    this.agentsService.sortDirection = direction;
  }

  /**
   * View agent details
   */
  viewAgent(data: Agent) {
    const modalRef = this.modalService.open(AgentDetailsComponent);
    modalRef.componentInstance.title = `Agent #${data.id}`;
    modalRef.componentInstance.agent = data;
    modalRef.componentInstance.agentsService = this.agentsService;

    modalRef.result.then(
      (result) => {
        this.toastService.show(
          result ? result.text : 'Agent details changed!',
          {
            classname: 'bg-primary text-light',
          }
        );
      },
      (reason) => {
        this.toastService.show(
          reason ? reason.text : 'No agent details changed.',
          {
            classname: 'bg-warning text-light',
          }
        );
      }
    );
  }

  /**
   * View agent details
   */
  addAgent() {
    const modalRef = this.modalService.open(NewAgentComponent, {
      size: 'lg',
      keyboard: false,
    });
    modalRef.componentInstance.title = `Add New Agent`;
    modalRef.componentInstance.agentsService = this.agentsService;
    modalRef.result.then(
      (result) => {
        console.debug(result);
        this.toastService.show(result ? result.text : 'New Agent added!', {
          classname: 'bg-primary text-light',
        });
      },
      (reason) => {
        this.toastService.show(reason ? reason.text : 'No agent added.', {
          classname: 'bg-warning text-light',
        });
      }
    );
  }

  /**
   * View agent details
   */
  agentTopUp(data: Agent) {
    const modalRef = this.modalService.open(AgentTopUpComponent, {
      keyboard: false,
    });
    modalRef.componentInstance.title = `Top Up Agent`;
    modalRef.componentInstance.agent = data;
    modalRef.componentInstance.agentsService = this.agentsService;
    modalRef.result.then(
      (result) => {
        this._fetchData();
        this.toastService.show(result ? result.text : 'Agent topped up!', {
          classname: 'bg-primary text-light',
        });
      },
      (reason) => {
        this.toastService.show(reason ? reason.text : 'Agent not topped up.', {
          classname: 'bg-warning text-light',
        });
      }
    );
  }
}
