import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { CustomHttpResponse } from 'src/app/model/custom-http-response';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public refreshing: boolean = false;
  private subs = new SubSink();
  public email: string="example@mail.com";

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
  }
  // On reset password
  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subs.add(this.userService.resetPassword(emailAddress).subscribe(
      (response: CustomHttpResponse) => {
        this.notificationService.notify(NotificationType.SUCCESS, response.message);
        this.refreshing = false;
        this.email = emailAddress;
        document.getElementById('reseted-password')?.click();
      }, (errorResposne: HttpErrorResponse) => {
        this.notificationService.notify(NotificationType.WARNING, errorResposne.error.message);
        this.refreshing = false;
      },
      () => emailForm.reset()
    ));
  }

}
