import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { Subscription, take } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class EditProfileComponent {
  public userEdit = new FormGroup({
    name: new FormControl('', [Validators.required]),
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  message: string = $localize`Do you want to delete this board?`;
  deleteMessage: string = $localize`Delete Confirmation`;
  private subscription!: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  public get nameUpdate(): AbstractControl {
    return this.userEdit.get('name') as AbstractControl;
  }
  public get loginUpdate(): AbstractControl {
    return this.userEdit.get('login') as AbstractControl;
  }
  public get passwordUpdate(): AbstractControl {
    return this.userEdit.get('password') as AbstractControl;
  }

  update() {
    this.subscription = this.authService
      .update(this.userEdit.value)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: `Success`,
            detail: `Profile changed`,
          });
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: `${e.error.statusCode} ${e.error.error}`,
            detail: `${e.error.message}`,
          });
        },
      });
  }
  delete() {
    this.confirmationService.confirm({
      message: `${this.message}`,
      header: `${this.deleteMessage}`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.authService
          .delete()
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'account deleted',
              });
              this.router.navigate(['/welcome']);
              this.authService.logout();
            },
            error: (e) => {
              this.messageService.add({
                severity: 'error',
                summary: `${e.error.statusCode} ${e.error.error}`,
                detail: `${e.error.message}`,
              });
            },
          });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }
}
