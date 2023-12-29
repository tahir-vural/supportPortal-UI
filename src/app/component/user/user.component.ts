import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
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
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject?.asObservable();
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
  public selectedAgency!: number;
  public isPhoneValidated: boolean = false;

  constructor(
    private autheticationService: AuthenticationService,
    private userService: UserService,
    private agencyService: AgencyService,
    private notificationService: NotificationService,
  ) {

  }

  ngOnInit(): void {
    this.user = this.autheticationService.getUserFromLocalCache();
    this.getUsers(true);
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  // get all users
  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subs.add(
      this.userService.getAllUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.users.forEach(result => result.contact = this.reformatContact(result.contact));
          this.getAgencies();
          this.refreshing = false;
          if (showNotification) {
          }
        }, (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
          this.refreshing = false;
        }
      )
    );
  }
  // get all Agencies
  public getAgencies(): void {
    this.subs.add(this.agencyService.getAll().subscribe(
      (response: Agency[]) => {
        this.agencies = response;
        this.selectedAgency = this.agencies[0].id
      }, (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        this.refreshing = false;
      }
    ));
  }
  // On add new User
  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormData('', userForm, this.profileImage)
    this.subs.add(
      this.userService.addUser(formData).subscribe(
        (response: User | any) => {
          this.clickButton('new-user-close');
          this.getUsers(false);
          this.fileName != null;
          userForm.reset();
          this.profileImage != null;
          this.notificationService.notify(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} added successfully`);
        }, (errorResposne: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, errorResposne.error.message);
          this.profileImage != null;
        }
      ))
  }
  // On edit user
  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.currentUserName = editUser.username;
    this.fileName = editUser.profileImageUrl.split('/')[6].split('%')[0];
    this.clickButton('openUserEdit');
    if (this.editUser.contact.length == 16 && this.editUser.contact[1] === '0') {
      this.isPhoneValidated = true;
    } else {
      this.isPhoneValidated = false;
    }
  }
  // On update User
  public onUpdateUser(ngForm: NgForm): void {
    const formData = this.userService.createUserFormData(this.currentUserName, ngForm, this.profileImage)
    this.subs.add(
      this.userService.updateUser(formData).subscribe(
        (response: User | any) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          this.fileName != null;
          this.profileImage != null;
          this.notificationService.notify(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
        }, (errorResposne: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, errorResposne.error.message);
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
  // On select user
  public onSelectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }
  // change title
  public changeTitle(title: string): void {
    if (title == "Users") {
      this.clickButton('show-users');
    }
    else if (title == "Reset Password") {
      this.clickButton("reset-password-setting")
    }
    this.titleSubject.next(title);
  }
  // On profile Image change
  public onProfileImageChange(event: any): void {
    this.fileName = event.target.files[0].name;
    this.profileImage = event.target.files[0];
  }
  // Save new User
  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }
  // On search
  public searchUser(searchTerm: string): void {
    const result: User[] = [];
    for (const user of this.userService.getUsersFromLocalCache()) {
      if (
        user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.email.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.userId.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      ) {
        result.push(user);
      }
    }
    this.users = result;
    if (result.length == 0 || !searchTerm) {
      this.users = this.userService.getUsersFromLocalCache();
    }
  }
  // On Delete User
  public onDeleteUser(username: string): void {
    this.subs.add(this.userService.deleteUser(username).subscribe(
      (response: CustomHttpResponse) => {
        this.notificationService.notify(NotificationType.SUCCESS, response.message);
        this.getUsers(false);
      },
      (errorResposne: HttpErrorResponse) => {
        this.notificationService.notify(NotificationType.ERROR, errorResposne.error.message);
      }
    ))
  }
  // On reset password
  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subs.add(this.userService.resetPassword(emailAddress).subscribe(
      (response: CustomHttpResponse) => {
        this.notificationService.notify(NotificationType.SUCCESS, response.message);
        this.refreshing = false;
      }, (errorResposne: HttpErrorResponse) => {
        this.notificationService.notify(NotificationType.WARNING, errorResposne.error.message);
        this.refreshing = false;
      },
      () => emailForm.reset()
    ))
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

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }
  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }
  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }
  // *************
  // private 
  // *************
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
  // click button
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }

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

}
