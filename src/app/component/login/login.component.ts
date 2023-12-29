import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/User';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public showLoading: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      if (this.authenticationService.getUserFromLocalCache().role == 'ROLE_USER'||this.authenticationService.getUserFromLocalCache().role == 'ROLE_HR'||this.authenticationService.getUserFromLocalCache().role == 'ROLE_MANAGER')
        this.router.navigateByUrl('/user')
      else
        this.router.navigateByUrl('/admin/main')
    }
    else {
      this.router.navigateByUrl('/login');
    }
  }

  public onLogin(user: User): void {
    this.showLoading = true;
    this.subscriptions.add(
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User> | any) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserLocalCache(response.body);
          if (this.authenticationService.getUserFromLocalCache().role == "ROLE_USER"||this.authenticationService.getUserFromLocalCache().role == 'ROLE_HR'||this.authenticationService.getUserFromLocalCache().role == 'ROLE_MANAGER')
            this.router.navigateByUrl('/user');
          else
            this.router.navigateByUrl('/admin/main');
          this.showLoading = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
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
