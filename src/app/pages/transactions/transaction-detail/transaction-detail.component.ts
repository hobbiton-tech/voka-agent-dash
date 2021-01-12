import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Transaction } from '../transactions.model';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit {
  @Input() title: string;
  @Input() transaction: Transaction;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
}
