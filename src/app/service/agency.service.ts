import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Agency } from '../model/Agency';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private host = environment.apiUrl+"/agency";

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Agency[]> {
    console.log("Fetching");
    return this.http.get<Agency[]>(`${this.host}`);
  }
  
  public insert(agency: Agency): Observable<Agency> {
    return this.http.post<Agency>(`${this.host}`, agency);
  }
  public update(agency: Agency): Observable<Agency> {
    return this.http.put<Agency>(`${this.host}/${agency.id}`, agency);
  }
  public deleteById(agencyId: number): Observable<void> {
    return this.http.delete<void>(`${this.host}/${agencyId}`);
  }
}
