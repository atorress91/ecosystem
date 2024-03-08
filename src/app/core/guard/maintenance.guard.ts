import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    if (environment.maintenance) {
      this.router.navigate(['/maintenance']);
      return false;
    }
    return true;
  }
}
