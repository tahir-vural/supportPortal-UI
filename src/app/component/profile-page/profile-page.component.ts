import { HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, empty, EMPTY } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Role } from 'src/app/enum/role.enum';
import { Agency } from 'src/app/model/Agency';
import { CustomHttpResponse } from 'src/app/model/custom-http-response';
import { FileUploadStatus } from 'src/app/model/file-upload.status';
import { User } from 'src/app/model/User';
import { AgencyService } from 'src/app/service/agency.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  public users: User[] = new Array<User>();
  public user!: User;
  public refreshing: boolean = false;
  private subs = new SubSink();
  public selectedUser!: User;
  public fileName!: string;
  public profileImage!: File;
  public editUser = new User();
  private currentUserName!: string;
  public fileStatus = new FileUploadStatus();
  public agencies: Agency[] = new Array<Agency>();
  public selectedAgency!: string;

  public isAgencySelected: Boolean = false;
  public isPhoneValidated: boolean = false;
  public phoneNumber: string = '';
  public passwordDoesnotMatch: boolean = false;
  public wrongPassword: boolean = false;

  constructor(
    private autheticationService: AuthenticationService,
    private userService: UserService,
    private agencyService: AgencyService,
    private notificationService: NotificationService,
    private router: Router

  ) {

  }

  ngOnInit(): void {
    this.user = this.autheticationService.getUserFromLocalCache();
    this.user.contact = this.phoneValidation(this.reformatContact(this.user.contact));
    this.getUsers(true);
    this.getAgencies();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  public getAgencies(): void {
    this.subs.add(this.agencyService.getAll().subscribe(
      (response: Agency[]) => {
        this.agencies = response;
      }, (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        this.refreshing = false;
      }
    ));
  }
  public passwordChangeClick(mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addHomeModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }

  // On profile Image change
  public onProfileImageChange(event: any): void {
    this.fileName = event.target.files[0].name;
    this.profileImage = event.target.files[0];
  }

  // log out
  public onLogOut(): void {
    this.autheticationService.logout();
    this.router.navigate(['/login']);
    this.sendNotification(NotificationType.SUCCESS, "You've been successfully logged out.")
  }

  //   update profile picture
  public updateProfileImage(): void {
    this.clickButton('profile-image-input');

  }
  public reset() {
    this.passwordDoesnotMatch = false;
  }


  public passwordChange(ngForm: NgForm) {
    const formData = this.userService.passworChange(ngForm)

    if (ngForm.value.newPassword == ngForm.value.confirmPassword) {
      this.passwordDoesnotMatch = false;
      this.subs.add(this.userService.updatePassword(formData).subscribe(
        (response: User | any) => {
          document.getElementById('add-home-form')?.click();
          ngForm.reset();
        },
        (errorResponse: HttpErrorResponse) => {
          this.wrongPassword = true;
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      ))
    }
    else {
      this.passwordDoesnotMatch = true;
    }
  }

  // get all users
  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subs.add(
      this.userService.getAllUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
        }, (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
          this.refreshing = false;
        }
      )
    );
  }

  // On update Current Password
  public onUpdateCurrentUser(ngForm: NgForm): void {
    this.refreshing = true;
    this.currentUserName = this.autheticationService.getUserFromLocalCache().username;
    const formData = this.userService.createUserFormData(this.currentUserName, ngForm, this.profileImage)
    this.subs.add(
      this.userService.updateUser(formData).subscribe(
        (response: User | any) => {
          this.autheticationService.addUserLocalCache(response);
          this.getUsers(false);
          this.fileName != null;
          this.profileImage != null;
          this.notificationService.notify(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
        }, (errorResposne: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, errorResposne.error.message);
          this.refreshing = true;
          this.profileImage != null;
        }
      ));
  }

  // On update profile image
  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage);
    this.subs.add(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadingProgress(event);
        }, (errorResposne: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, errorResposne.error.message);
          this.fileStatus.status = 'done';
        }
      ));
  }

  // Selected Agency
  public onAgencyChange(state: any): void {
    this.selectedAgency = state.target.value;
    if (this.selectedAgency != "") {
      this.isAgencySelected = true;
    }
    else {
      this.isAgencySelected = false;
    }
  }

  public phoneValidation(phoneContact: string): string {
    if (phoneContact.length == 16 && phoneContact[0] == '(' && phoneContact[1] == '0') {
      this.isPhoneValidated = true;
    } else {
      this.isPhoneValidated = false;
    }
    return phoneContact;
  }

  public get lengthOfContact(): boolean {
    return (this.phoneNumber.length <= 10);
  }
  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }
  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }
  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }
  // private 
  // report uploading progress
  private reportUploadingProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        if (event.total) {
          this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
          this.fileStatus.status = 'progress';
        }
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.sendNotification(NotificationType.SUCCESS, ` ${event.body.firstName}\'s profile image updated successfully`);
          this.fileStatus.status = 'done';
        } else {
          this.sendNotification(NotificationType.ERROR, `unable to upload profile image, Please try again`);
        }
        break;
      default:
        `Finished all processes`;
    }
  }
  public passwordRes(): void {
    this.wrongPassword = false;
  }
  private getUserRole(): string {
    return this.autheticationService.getUserFromLocalCache().role;
  }

  // Send notification
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, "An error occured. Please try again.");
    }
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
  // reformat contact
  public reformatContact(editUserContact: any): string {
    var phoneContact = '';
    for (let i = 0; i < editUserContact.length; i++)
      if ((Number(editUserContact[i]) >= 0 && Number(editUserContact[i]) <= 9))
        phoneContact = phoneContact + editUserContact[i]
    if (phoneContact[0] == '0')
      phoneContact = '(' + phoneContact.slice(0, 4) + ')-' + phoneContact.slice(4, 7) + '-' + phoneContact.slice(7, 9) + '-' + phoneContact.slice(9, 11);
    else {
      phoneContact = '(0' + phoneContact.slice(0, 3) + ')-' + phoneContact.slice(3, 6) + '-' + phoneContact.slice(6, 8) + '-' + phoneContact.slice(8, 10);
    }
    return phoneContact;
  }

  // click button
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }
}
