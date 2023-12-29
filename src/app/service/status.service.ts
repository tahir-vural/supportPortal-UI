import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Status } from '../model/Status';
@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private apiServerUrl = environment.apiUrl + "/status";
  
  constructor(private http: HttpClient) { }

  public getAll(): Observable<Status[]> {
    return this.http.get<Status[]>(`${this.apiServerUrl}`);
  }

  public insert(status: Status): Observable<Status> {
    return this.http.post<Status>(`${this.apiServerUrl}`, status);
  }

  public update(status: Status): Observable<Status> {
    return this.http.put<Status>(`${this.apiServerUrl}/${status.id}`, status);
  }
  
  public deleteById(statusId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/${statusId}`);
  }
}
