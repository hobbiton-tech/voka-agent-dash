import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Agent, Partner } from '../agents.model';
import { AgentsService } from '../agents.service';
import { BalanceService } from '../../../shared/services/balance.service';
import { DecimalPipe } from '@angular/common';
import { TopbarComponent } from '../../../layouts/shared/topbar/topbar.component';
import { Observable, of, Subject } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';

interface Alert {
  type: string;
  message: string;
  closed: boolean;
}

@Component({
  selector: 'app-agent-top-up',
  templateUrl: './agent-top-up.component.html',
  styleUrls: ['./agent-top-up.component.scss'],
  providers: [AgentsService, DecimalPipe, TopbarComponent, FormBuilder],
})
export class AgentTopUpComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() agent: Agent;
  @Input() agentsService: AgentsService;
  alert: Alert = {
    message: '',
    type: 'warning',
    closed: true,
  };
  submit: boolean;
  topUpAgentForm: FormGroup;
  private unsubscribe$: Subject<void> = new Subject<void>();
  adminBalance: number;
  newAdminBalance: number;

  constructor(
    public formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private balanceService: BalanceService,
    private topbarComponent: TopbarComponent
  ) {}

  ngOnInit() {
    // get the account balance
    this._fetchAdminBalance();

    /**
     * Form data
     */
    this.topUpAgentForm = this.formBuilder.group({
      amount: [
        '',
        [Validators.required, Validators.pattern(/[0-9]+\.[0-9]{2}/)],
      ],
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Returns form
   */
  get form() {
    return this.topUpAgentForm.controls;
  }

  /**
   * Bootsrap validation form submit method
   */
  validSubmit() {
    const values = this.topUpAgentForm.value;
    let errors: boolean;

    try {
      if (!this.form.amount.errors) {
        this.submit = true;
        errors = false;
      } else {
        this.submit = false;
        errors = true;
      }

      if (values.amount > this.adminBalance) {
        this.submit = false;
        throw new Error(
          'Please check that you have entered a value and that it is less than your available float balance.'
        );
      }

      if (!errors && this.submit) {
        // Top up agent balance
        this.agentsService
          .agentTopUp({
            MSISDN: this.agent.MSISDN,
            amount: parseFloat(values.amount),
          })
          .pipe(take(1), catchError(this.handleError<Agent>('Agent top up')))
          .subscribe((toppedUpAgent) => {
            this.agentsService._fetchPartners();

            // Close modal
            this.activeModal.close({
              text: `Agent topped up successfully!`,
            });
          });
        // // Top up agent balance
        // this.agentsService
        //   .agentTopUp({
        //     MSISDN: this.agent.MSISDN,
        //     amount: parseFloat(values.amount),
        //   })
        //   .pipe(take(1), catchError(this.handleError<Agent>('Agent top up')))
        //   .subscribe((toppedUpAgent) => {
        //     this.agentsService._fetchAgents();
        //     this.topbarComponent._fetchBalance();

        //     // Close modal
        //     this.activeModal.close({
        //       text: `Agent topped up successfully!`,
        //     });
        //   });

      } else {
        throw new Error('Please enter a balance including the total ngwee.');
      }
    } catch (error) {
      this.openAlert(error.message, 'danger');
    }
  }

  /**
   * Fetch admin balance
   */
  _fetchAdminBalance(): void {
    this.balanceService._fetchBalance();

    // this.balanceService.floatBalance$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((balance) => (this.adminBalance = balance));
  }

  closeAlert(): void {
    // this.alert.closed = !this.alert.closed;
    this.alert.message = '';
  }

  openAlert(msg: string, type?: string): void {
    this.alert.closed = !this.alert.closed;
    this.alert.message = msg;
    setTimeout(() => (this.alert.closed = !this.alert.closed), 5000);
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
