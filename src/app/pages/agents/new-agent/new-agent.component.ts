import { Component, OnInit, Input, Output } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentsService } from '../agents.service';
import { DecimalPipe } from '@angular/common';
import { catchError, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Agent, Partner } from '../agents.model';

@Component({
  selector: 'app-new-agent',
  templateUrl: './new-agent.component.html',
  styleUrls: ['./new-agent.component.scss'],
  providers: [AgentsService, DecimalPipe, FormBuilder],
})
export class NewAgentComponent implements OnInit {
  @Input() title: string;
  @Input() agentsService: AgentsService;
  submit: boolean;
  newAgentForm: FormGroup;
  balance: FormControl;

  constructor(
    public formBuilder: FormBuilder,
    public activeModal: NgbActiveModal
  ) {
    this.balance = formBuilder.control({ value: '0.00', disabled: true });
  }

  ngOnInit() {
    /**
     * Form data
     */
    this.newAgentForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', Validators.required],
      nrc: ['', [Validators.required, Validators.pattern(/[0-9]+[/][0-9]+[/]/)]],
      phone_number: ['', [Validators.required, Validators.pattern(/(260)[0-9]+/)]],
      location: ['', Validators.required],
      agent_pin: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  /**
   * Returns form
   */
  get form() {
    return this.newAgentForm.controls;
  }

  /**
   * Bootsrap validation form submit method
   */
  validSubmit() {
    console.log('new Agent submit clicked')
    const values = this.newAgentForm.value;
    let errors: boolean;

    try {
      for (const property in values) {
        if (!this.form[property].errors) {
          this.submit = true;
          errors = false;
        } else {
          this.submit = false;
          errors = true;
          throw new Error('Some fields have errors!');
        }
      }

      if (!errors && this.submit) {
        console.log('name submitted is>>',values.name)
        // Submit new Agent to server
        this.agentsService
          .addAgent({
            ...values,
            first_name: this.titleCase(values.first_name),
            last_name: this.titleCase(values.last_name),
            MSISDN: values.phone_number,
            location: values.location,
            NRC: values.nrc,
            pin: values.agnet_pin
          })
          .pipe(take(1), catchError(this.handleError<Agent>('Partener addition')))
          .subscribe((newAgent) => {
            this.agentsService._fetchAgents();
            console.log('new partner>>', newAgent);
            // Close modal
            this.activeModal.close({
              text: `New Agent added successfully!`,
            });
          });
        // Submit new agent to server
        // this.agentsService
        //   .addAgent({
        //     ...values,
        //     first_name: this.titleCase(values.first_name),
        //     last_name: this.titleCase(values.last_name),
        //     location: this.titleCase(values.location),
        //   })
        //   .pipe(take(1), catchError(this.handleError<Agent>('Agent addition')))
        //   .subscribe((newAgent) => {
        //     this.agentsService._fetchAgents();

        //     // Close modal
        //     this.activeModal.close({
        //       text: `New agent ${newAgent.MSISDN} added successfully!`,
        //     });
        //   });
      } else {
        throw new Error('An error occured!');
      }
    } catch (error) {
      this.activeModal.dismiss({
        text: `Agent addition failed: ${error.message}`,
        classname: `bg-danger text-light`,
      });
    }
  }

  titleCase(string: string): string {
    return string
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join(' ');
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
