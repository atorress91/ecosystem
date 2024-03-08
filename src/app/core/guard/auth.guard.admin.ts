import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../service/authentication-service/auth.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardAdmin implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(environment.maintenance){
      this.router.navigate(['/maintenance']).then();
      return false;
    }
    if (this.authService.currentUserAdminValue) {
      return true;
    }

    this.router.navigate(['/signin']);
    return false;
  }
}
