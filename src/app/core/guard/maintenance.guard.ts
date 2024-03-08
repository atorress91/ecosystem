import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { MaintenanceService } from '../service/maintenance-service/maintenance.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {
  isUnderMaintenance: boolean = false;

  constructor(private router: Router, private maintenanceService: MaintenanceService) {
    this.maintenanceService.checkMaintenance().subscribe((maintenance) => {
      console.log(maintenance);
      this.isUnderMaintenance = maintenance;
    });
  }

  canActivate(): Observable<boolean> {
    return this.maintenanceService.checkMaintenance().pipe(
      map((isUnderMaintenance) => {
        if (isUnderMaintenance) {
          this.router.navigate(['/maintenance']);
          return false;
        }
        return true;
      })
    );
  }
}
