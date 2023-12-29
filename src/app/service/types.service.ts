import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Type } from '../model/Type';
@Injectable({
  providedIn: 'root'
})
export class TypesService {
  private apiServerUrl = environment.apiUrl + "/type";
  
  constructor(private http: HttpClient) { }

  public getAll(): Observable<Type[]> {
    return this.http.get<Type[]>(`${this.apiServerUrl}`);
  }

  public insert(type: Type): Observable<Type> {
    return this.http.post<Type>(`${this.apiServerUrl}`, type);
  }

  public update(type: Type): Observable<Type> {
    return this.http.put<Type>(`${this.apiServerUrl}/${type.id}`, type);
  }
  
  public deleteById(typeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/${typeId}`);
  }
}
