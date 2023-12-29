import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/User';
import { JwtHelperService } from '@auth0/angular-jwt'
import { CustomHttpResponse } from '../model/custom-http-response';
import { NgForm } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.apiUrl;
  private jwtHelper = new JwtHelperService();


  constructor(private http: HttpClient) { }

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/list`);
  }
  public getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.host}/user/find/${username}`);
  }
  public addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update`, formData);
  }

  public updatePassword(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update-password`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/user/reset-password/${email}`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<any>> {
    return this.http.post<HttpEvent<any>>(`${this.host}/user/update-profile-image`, formData,
      {
        reportProgress: true,
        observe: 'events'
      });
  }

  public deleteUser(username: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/delete/${username}`);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users') || '{}');
    }
    return null as any;
  }

  public createUserFormData(loggedInUsername: string, ngForm: NgForm, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', ngForm.value.firstName);
    formData.append('lastName', ngForm.value.lastName);
    formData.append('username', ngForm.value.username);
    formData.append('email', ngForm.value.email);
    formData.append('role', ngForm.value.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', ngForm.value.active);
    formData.append('agencyId', ngForm.value.agencyId);
    formData.append('contact', ngForm.value.contact);
    formData.append('isNonLocked', ngForm.value.notLocked);
    return formData;
  }
  public passworChange( ngForm: NgForm): FormData {
    const formData = new FormData();
    formData.append('username', ngForm.value.username);
    console.log(ngForm.value)
    formData.append('currentPassword', ngForm.value.currentPassword);
    formData.append('newPassword', ngForm.value.newPassword);
    return formData;
  }
  public updateUserFormData(currentUserName:string,user: User, ngForm: NgForm, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', currentUserName);
    formData.append('firstName', ngForm.value.firstName);
    formData.append('lastName', ngForm.value.lastName);
    formData.append('username', ngForm.value.username);
    formData.append('email', ngForm.value.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', user.active.toString());
    formData.append('agencyId', user.agency.id.toString());
    formData.append('contact', ngForm.value.contact);
    formData.append('isNonLocked',user.notLocked.toString());
    return formData;
  }


}
