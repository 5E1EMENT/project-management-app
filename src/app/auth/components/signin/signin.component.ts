import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  providers: [MessageService],
})
export class SigninComponent {
  public userSignin = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}
  public get loginSignin(): AbstractControl {
    return this.userSignin.get('login') as AbstractControl;
  }
  public get passwordSignin(): AbstractControl {
    return this.userSignin.get('password') as AbstractControl;
  }
  signin() {
    this.authService
      .signin(this.userSignin.value)
      .pipe(take(1))
      .subscribe({
        next: (token: string) => {
          this.authService.saveToken(token);
          this.router.navigate(['/boards']);
        },
        error: (e) => {
          if (e.status === 403) {
            this.messageService.add({
              severity: 'error',
              summary: `User not found!`,
              detail: `Please, please check the entered data.`,
            });
          } else if (e.status === 400) {
            this.messageService.add({
              severity: 'error',
              summary: `Password should not be empty!`,
              detail: `Please, fill in all the fields.`,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: `${e.error.statusCode} ${e.statusText}`,
              detail: `${e.error.message}, `,
            });
          }
        },
      });
  }
}
