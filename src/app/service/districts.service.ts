import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { District } from '../model/District';

@Injectable({
  providedIn: 'root'
})
export class DistrictsService {
  private apiServerUrl = environment.apiUrl + "/district";

  constructor(private http: HttpClient) { }
  public getAll(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiServerUrl}`);
  }
  public insert(district: District): Observable<District> {
    return this.http.post<District>(`${this.apiServerUrl}`, district);
  }
  public update(district: District): Observable<District> {
    return this.http.put<District>(`${this.apiServerUrl}/${district.id}`, district);
  }
  public deleteById(districtId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/${districtId}`);
  }
}
