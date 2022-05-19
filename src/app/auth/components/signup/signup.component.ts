import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription, take } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [MessageService],
})
export class SignupComponent {
  public userSignup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  public get nameSignup(): AbstractControl {
    return this.userSignup.get('name') as AbstractControl;
  }
  public get loginSignup(): AbstractControl {
    return this.userSignup.get('login') as AbstractControl;
  }
  public get passwordSignup(): AbstractControl {
    return this.userSignup.get('password') as AbstractControl;
  }

  signup() {
    this.authService
      .signup(this.userSignup.value)
      .pipe(take(1))
      .subscribe({
        next: (token: string) => {
          this.authService.saveToken(token);
          this.router.navigate(['/boards']);
        },
        error: (e) => {
          if (e.status === 409) {
            this.messageService.add({
              severity: 'error',
              summary: `User login already exists!`,
              detail: `Please, choose another login.`,
            });
          } else if (e.status === 400) {
            this.messageService.add({
              severity: 'error',
              summary: `${e.error.message[0]}!`,
              detail: `Please, fill in all the fields.`,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: `${e.error.statusCode} ${e.error.error}`,
              detail: `${e.error.message}`,
            });
          }
        },
      });
  }
}
