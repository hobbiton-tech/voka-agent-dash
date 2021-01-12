import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';

import { Notification } from './topbar.model';

import { notificationItems } from './data';
import { BalanceService } from '../../../shared/services/balance.service';
import { User } from '../../../core/models/auth.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  mtnBalance: number;
  necorBalance: number;
  masterBalance: number;
  currentUser: User;

  notificationItems: Notification[];
  languages: Array<{
    id: number;
    flag?: string;
    name: string;
  }>;
  selectedLanguage: {
    id: number;
    flag?: string;
    name: string;
  };

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private balanceService: BalanceService
  ) {}

  ngOnInit() {
    // get the notifications
    // this._fetchNotifications();
    // this.openMobileMenu = false;
    // get the account balance
    this._fetchMtnBalance();
    // this._fetchNecorBalance();
    this.currentUser = this.authService.currentUser();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Change the language
   * @param language language
   */
  changeLanguage(language) {
    this.selectedLanguage = language;
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Refresh admin float balance
   */
  refreshMtnBalance(): void {
    this._fetchMtnBalance();
  }

  refreshNecorBalance(): void {
    this._fetchNecorBalance();
  }

  /**
   * Logout the user
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/account/login']);
  }

  /**
   * Fetches the notification
   * Note: For now returns the hard coded notifications
   */
  _fetchNotifications() {
    this.notificationItems = notificationItems;
  }

  /**
   * Fetch admin balance
   */
  _fetchMtnBalance(): void {
    this.balanceService._fetchBalance();

    this.balanceService.mtnFloat$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((balance) => {
        this.mtnBalance = balance;
      });
  }

  _fetchNecorBalance(): void {
    this.balanceService._fetchNecorBalance();

    this.balanceService.necorFloat$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((balance) => {
        console.log('new balance>>>>', balance);

        this.necorBalance = balance;
      });
  }


}
