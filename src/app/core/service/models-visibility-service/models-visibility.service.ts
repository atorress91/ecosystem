import { Injectable } from "@angular/core";
import { ConfigurationService } from "../configuration-service/configuration.service";
import { combineLatest, map, Observable } from "rxjs";
import { AuthService } from "../authentication-service/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ModelsVisibilityService {
  constructor(private configService: ConfigurationService, private authService: AuthService) { }

  canUserSeePaymentModels(): Observable<boolean> {
    return combineLatest([
      this.configService.getGeneralConfiguration(),
      this.authService.currentUserAffiliate
    ]).pipe(
      map(([config, userAffiliate]) => {
        console.log(userAffiliate)
        if (config.success && config.data && userAffiliate) {
          const cutoffDate = new Date(config.data.paymentModelCutoffDate);

          return new Date(userAffiliate.created_at) < cutoffDate;
        }
        return true;
      })
    );
  }
}
