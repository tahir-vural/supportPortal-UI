import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Currency } from '../model/Currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiServerUrl = environment.apiUrl + "/currency";

  constructor(private http: HttpClient) { }
  public getAll(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.apiServerUrl}`);
  }
  public insert(currency: Currency): Observable<Currency> {
    return this.http.post<Currency>(`${this.apiServerUrl}`, currency);
  }
  public update(currency: Currency): Observable<Currency> {
    return this.http.put<Currency>(`${this.apiServerUrl}/${currency.id}`, currency);
  }
  public deleteById(currencyId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/${currencyId}`);
  }
}
