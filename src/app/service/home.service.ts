import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Home } from '../model/Home';
import { User } from '../model/User';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiServerUrl = environment.apiUrl + "/home";

  constructor(private http: HttpClient) { }
  public getAll(): Observable<Home[]> {
    return this.http.get<Home[]>(`${this.apiServerUrl}`);
  }
  public insert(formData: FormData): Observable<Home> {
    return this.http.post<Home>(`${this.apiServerUrl}`, formData);
  }
  public getAllById(id:any):Observable<Home[]>{
    return this.http.get<Home[]>(`${this.apiServerUrl}/user/${id}`)
  }
  public update(homeId:number,formData: FormData): Observable<Home> {
    return this.http.put<Home>(`${this.apiServerUrl}/${homeId}`, formData);
  }
  public deleteById(homeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/${homeId}`);
  }

  public getFormData(ngForm:NgForm):FormData{
    const formData = new FormData();
    formData.append('price', ngForm.value.price);
    formData.append('neighbourhoodId', ngForm.value.neighbourhoodId);
    formData.append('typeId', ngForm.value.typeId);
    formData.append('roomNumberId', ngForm.value.roomNumberId);
    formData.append('currencyId', ngForm.value.currencyId);
    formData.append('hometypeId', ngForm.value.homeTypeId);
    formData.append('userId', ngForm.value.userId);
    formData.append('floorNumber', ngForm.value.floorNumber);
    formData.append('totalFloor', ngForm.value.totalFloor);
    formData.append('homeTypeId', ngForm.value.homeTypeId);
    formData.append('address', ngForm.value.address);
    formData.append('details', ngForm.value.details);
    formData.append('statusId', ngForm.value.statusId);
    formData.append('header',ngForm.value.header);
    return formData;
  }
}
