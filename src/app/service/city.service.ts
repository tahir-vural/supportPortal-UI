import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { City } from '../model/City';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiServerUrl = environment.apiUrl + "/city";

  constructor(private http: HttpClient) { }
  public getAll(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiServerUrl}`);
  }
  public insert(city: City): Observable<City> {
    return this.http.post<City>(`${this.apiServerUrl}`, city);
  }
  public update(city: City): Observable<City> {
    return this.http.put<City>(`${this.apiServerUrl}/${city.id}`, city);
  }
  public deleteById(cityId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/${cityId}`);
  }
}
