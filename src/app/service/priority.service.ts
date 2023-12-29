import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Priority } from '../model/Priority';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  private apiServerUrl = environment.apiUrl + "/priority";
  
  constructor(private http: HttpClient) { }

  public getAll(): Observable<Priority[]> {
    return this.http.get<Priority[]>(`${this.apiServerUrl}`);
  }
  public getPriorityById(priorityId:number): Observable<Priority> {
    return this.http.get<Priority>(`${this.apiServerUrl}/${priorityId}`);
  }

  public insert(priority: Priority): Observable<Priority> {
    return this.http.post<Priority>(`${this.apiServerUrl}`, priority);
  }

  public update(priority: Priority): Observable<Priority> {
    return this.http.put<Priority>(`${this.apiServerUrl}/${priority.id}`, priority);
  }
  
  public deleteById(priorityId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/${priorityId}`);
  }
}