import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';

import { Response } from '@app/core/models/response-model/response.model';

const httpOptions = {

  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': environment.tokens.systemConfigurationService.toString() }),
};

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private urlApi: string;

  constructor(private router: Router, private http: HttpClient) {
    this.urlApi = environment.apis.systemConfigurationService;
  }

  checkMaintenance(): Observable<boolean> {
    return this.http.get<Response>(this.urlApi.concat('/configuration/is_under_maintenance'), httpOptions).pipe(
      map((response) => {
        if (response.success) return response.data;
        else {
          console.error('ERROR: ' + response);
          return null;
        }
      })
    );
  }
}
