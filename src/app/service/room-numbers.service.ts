import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { RoomNumber } from '../model/RoomNumber';
@Injectable({
  providedIn: 'root'
})
export class RoomNumbersService {

  private apiServerUrl = environment.apiUrl + "/room/number";
  
  constructor(private http: HttpClient) { }

  public getAll(): Observable<RoomNumber[]> {
    return this.http.get<RoomNumber[]>(`${this.apiServerUrl}`);
  }

  public insert(roomNumber: RoomNumber): Observable<RoomNumber> {
    return this.http.post<RoomNumber>(`${this.apiServerUrl}`, roomNumber);
  }

  public update(roomNumber: RoomNumber): Observable<RoomNumber> {
    return this.http.put<RoomNumber>(`${this.apiServerUrl}/${roomNumber.id}`, roomNumber);
  }
  
  public deleteById(roomNumberId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/${roomNumberId}`);
  }
}
