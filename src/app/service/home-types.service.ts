import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HomeType } from '../model/HomeType';

@Injectable({
  providedIn: 'root'
})
export class HomeTypeService {
  private apiServerUrl = environment.apiUrl + "/home/type";

  constructor(private http: HttpClient) { }
  public getAll(): Observable<HomeType[]> {
    return this.http.get<HomeType[]>(`${this.apiServerUrl}`);
  }
  public insert(homeType: HomeType): Observable<HomeType> {
    return this.http.post<HomeType>(`${this.apiServerUrl}`, homeType);
  }
  public update(homeType: HomeType): Observable<HomeType> {
    return this.http.put<HomeType>(`${this.apiServerUrl}/${homeType.id}`, homeType);
  }
  public deleteById(homeTypeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/${homeTypeId}`);
  }
}
