import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  constructor(private http: HttpClient) { }

  checkMaintenance(): Observable<boolean> {
    return this.http.get<boolean>('api/maintenance');
  }
}
