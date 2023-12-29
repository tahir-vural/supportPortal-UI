import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestedHomes } from '../model/RequestedHomes';

@Injectable({
  providedIn: 'root'
})
export class RequestedHomesService {
  private apiServerUrl = environment.apiUrl + "/requested-homes";

  constructor(private http: HttpClient) { }

  public getAll(): Observable<RequestedHomes[]> {
    return this.http.get<RequestedHomes[]>(`${this.apiServerUrl}`);
  }
  public getRequestedHomesById(requestedHomesId: number): Observable<RequestedHomes> {
    return this.http.get<RequestedHomes>(`${this.apiServerUrl}/${requestedHomesId}`);
  }

  public insert(formData: FormData): Observable<RequestedHomes> {
    return this.http.post<RequestedHomes>(`${this.apiServerUrl}`,formData);
  }

  public update(requestedHomesId: number,formData:FormData): Observable<RequestedHomes> {
    return this.http.put<RequestedHomes>(`${this.apiServerUrl}/${requestedHomesId}`, formData);
  }

  public deleteById(requestedHomesId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/${requestedHomesId}`);
  }

  public getFormData(ngForm: NgForm): FormData {
    const formData = new FormData();
    formData.append('recipientsName', ngForm.value.recipientsName);
    formData.append('currencyId', ngForm.value.currencyId);
    formData.append('priorityId', ngForm.value.priorityId);
    formData.append('location', ngForm.value.location);
    formData.append('budget', ngForm.value.budget);
    formData.append('roomNumberId', ngForm.value.roomNumberId);
    formData.append('statusId', ngForm.value.statusId);
    formData.append('floors', ngForm.value.floors);
    formData.append('userId', ngForm.value.userId);
    formData.append('note', ngForm.value.note);
    return formData;
  }
}