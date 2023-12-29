import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Neighbourhood } from '../model/Neighbourhood';

@Injectable({
  providedIn: 'root'
})
export class NeighbourhoodService {
  private apiServerUrl = environment.apiUrl + "/neighbourhood";

  constructor(private http: HttpClient) { }
  
  public getAll(): Observable<Neighbourhood[]> {
    return this.http.get<Neighbourhood[]>(`${this.apiServerUrl}`);
  }
  public insert(neighbourhood: Neighbourhood): Observable<Neighbourhood> {
    return this.http.post<Neighbourhood>(`${this.apiServerUrl}`, neighbourhood);
  }
  public update(neighbourhood: Neighbourhood): Observable<Neighbourhood> {
    return this.http.put<Neighbourhood>(`${this.apiServerUrl}/${neighbourhood.id}`, neighbourhood);
  }
  public deleteById(neighbourhoodId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/${neighbourhoodId}`);
  }
}
