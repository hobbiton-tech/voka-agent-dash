import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  signupForm: FormGroup;
  submitted = false;
  error = '';
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/[a-zaA-Z]+\s[a-zA-Z]/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    document.body.classList.add('authentication-bg');
    document.body.classList.add('authentication-bg-pattern');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  /**
   * On submit form
   */
  onSubmit() {
    const registrationData = this.signupForm.value;
    // Sanitize name
    registrationData.first_name = this.titleCase(registrationData.name).split(
      ' '
    )[0];
    registrationData.last_name = this.titleCase(registrationData.name).split(
      ' '
    )[1];
    delete registrationData.name;

    registrationData.setPasswordLink = `${environment.baseUrl}/account/reset-password`;
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService
      .register(registrationData)
      .then((res) => {
        this.loading = false;
        this.router.navigate(['/account/complete-registration']);
      })
      .catch((error) => {
        this.loading = false;
        console.error(error);
      });
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
}
