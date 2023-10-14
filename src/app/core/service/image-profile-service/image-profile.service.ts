import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../authentication-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImageProfileService {
  private imageURLSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  imageURL$ = this.imageURLSubject.asObservable();

  constructor(private authService: AuthService) {
    this.setImageURL(this.authService.currentUserAffiliateValue.image_profile_url);
  }

  setImageURL(url: string | null) {
    this.imageURLSubject.next(url);
  }

}
