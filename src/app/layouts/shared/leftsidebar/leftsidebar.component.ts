import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { SIDEBAR_WIDTH_CONDENSED } from '../../layout.model';
import { User } from '../../../core/models/auth.models';

@Component({
  selector: 'app-leftsidebar',
  templateUrl: './leftsidebar.component.html',
  styleUrls: ['./leftsidebar.component.scss'],
})
export class LeftsidebarComponent implements OnInit {
  @Input() sidebarType: string;
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUser();
  }

  /**
   * Is sidebar condensed?
   */
  isSidebarCondensed() {
    return this.sidebarType === SIDEBAR_WIDTH_CONDENSED;
  }

  /**
   * Logout the user
   */
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/account/login'], {
      queryParams: { returnUrl: '/' },
    });
  }
}
