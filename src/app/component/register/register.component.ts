import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Agency } from 'src/app/model/Agency';
import { User } from 'src/app/model/User';
import { AgencyService } from 'src/app/service/agency.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public showLoading: boolean = false;
  private subscriptions: Subscription = new Subscription();
  public agencies!: Agency[];
  public isPhoneValidated: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private agnecyService: AgencyService
  ) { }

  ngOnInit(): void {
  }
 

  public onRegister(user: User): void {
    this.showLoading = true;
    this.subscriptions.add(
      this.authenticationService.register(user).subscribe(
        (response: User) => {
          this.showLoading = false;
          this.sendNotification(NotificationType.SUCCESS, `A new Account has created  for ${response.firstName}.
          Please check your email for password to log in.`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }
    // contact Control
    public contactValidation(event: any): boolean {
      if ((Number(event.key) >= 0 && Number(event.key) <= 9)) {
        if (event.key === '0' && event.target.value.length === 0)
          event.target.value = '(' + event.target.value;
        if (event.target.value[0] !== '(' && event.target.value[1] !== '0')
          event.target.value = '(0' + event.target.value;
        if (event.target.value.length == 5)
          event.target.value = event.target.value + ')-';
        if (event.target.value.length == 10 || event.target.value.length == 13)
          event.target.value = event.target.value + '-';
        return (event.target.value.length <= 15);
      } else {
        return false;
      }
    }
    // on contact input change control
    public onContactInputChangeControl(event: any): void {
      if (event.target.value.length == 16 && event.target.value[1] === '0') {
        this.isPhoneValidated = true;
      } else {
        this.isPhoneValidated = false;
      }
    }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, "An error occured. Please try again.");
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
