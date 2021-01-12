import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Agent, AgentStatus, Partner } from '../agents.model';
import { AgentsService } from '../agents.service';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-agent-details',
  templateUrl: './agent-details.component.html',
  styleUrls: ['./agent-details.component.scss'],
})
export class AgentDetailsComponent implements OnInit {
  @Input() title: string;
  @Input() agentsService: AgentsService;
  @Input() agent: Agent;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  activateCurrentAgent() {
    // try {
    //   this.agentsService
    //     ._changeAgentStatus({
    //       MSISDN: Number(this.agent.MSISDN),
    //       status: AgentStatus.ACTIVE,
    //     })
    //     .pipe(take(1), catchError(this.handleError<Agent>('Partner activation')))
    //     .subscribe((agent) => {
    //       this.agentsService._fetchAgents();
    //       // Close modal
    //       this.activeModal.close({
    //         text: `Partner ${agent.MSISDN} activated successfully!`,
    //       });
    //     });
    // } catch (error) {
    //   this.activeModal.dismiss({
    //     text: `Partner activation failed: ${error.message}`,
    //     classname: `bg-danger text-light`,
    //   });
    // }
  }

  suspendCurrentAgent() {
    // try {
    //   this.agentsService
    //     ._changeAgentStatus({
    //       MSISDN: Number(this.agent.MSISDN),
    //       status: AgentStatus.INACTIVE,
    //     })
    //     .pipe(take(1), catchError(this.handleError<Agent>('Partner suspension')))
    //     .subscribe((agent) => {
    //       this.agentsService._fetchAgents();
    //       // Close modal
    //       this.activeModal.close({
    //         text: `Partner ${agent.MSISDN} suspended successfully!`,
    //       });
    //     });
    // } catch (error) {
    //   this.activeModal.dismiss({
    //     text: `Partner suspension failed: ${error.message}`,
    //     classname: `bg-danger text-light`,
    //   });
    // }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      this.activeModal.dismiss({
        text: `${operation} failed: ${error.message}`,
        classname: `bg-danger text-light`,
      });

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
