import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Signin } from '@app/core/models/signin-model/signin.model';
import { User } from '@app/core/models/user-model/user.model';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { environment } from '@environments/environment';
import { Response } from '@app/core/models/response-model/response.model';
import { ToastrService } from 'ngx-toastr';


import { CartService } from '../cart.service/cart.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: environment.tokens.accountService.toString(),
    'X-Client-ID': environment.tokens.clientID.toString()
  }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserAffiliateSubject: BehaviorSubject<UserAffiliate>;
  public currentUserAffiliate: Observable<UserAffiliate>;

  private currentUserAdminSubject: BehaviorSubject<User>;
  public currentUserAdmin: Observable<User>;
  private urlApi: string;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cartService: CartService,

  ) {
    this.currentUserAffiliateSubject = new BehaviorSubject<UserAffiliate>(
      JSON.parse(localStorage.getItem('currentUserAffiliate'))
    );
    this.currentUserAdminSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUserAdmin'))
    );
    this.currentUserAffiliate = this.currentUserAffiliateSubject.asObservable();
    this.currentUserAdmin = this.currentUserAdminSubject.asObservable();
    this.urlApi = environment.apis.accountService;
  }

  public get currentUserAffiliateValue(): UserAffiliate {
    return this.currentUserAffiliateSubject.value;
  }

  public get currentUserAdminValue(): User {
    return this.currentUserAdminSubject.value;
  }

  loginUser(userCredentials: Signin) {
    return this.http
      .post<Response>(
        this.urlApi.concat('/auth/login'),
        userCredentials,
        httpOptions
      )
      .pipe(
        map((response: Response) => {
          if (response.success) {
            this.valiteUserType(response);
          }
          return response;
        })
      );
  }

  valiteUserType(response: Response) {
    let isUserAffiliate = response.data.is_affiliate;
    if (isUserAffiliate) {
      this.setUserAffiliateValue(response.data);
    } else {
      this.setUserAdminValue(response.data);
    }
  }

  UserAffiliateEmailConfirmation(userName: string) {
    console.log(httpOptions);
    return this.http
      .put(
        this.urlApi.concat('/useraffiliateinfo/email_confirmation/', userName),
        {},
        httpOptions
      )
      .pipe(
        map((data) => {
          return data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  logoutUser() {
    this.cartService.removeAllCart();
    localStorage.removeItem('currentUserAdmin');
    localStorage.removeItem('currentUserAffiliate');
    this.currentUserAffiliateSubject.next(null);
    this.currentUserAdminSubject.next(null);

    this.toastr.clear();

    return of({ success: false });
  }

  public setUserAffiliateValue(user: UserAffiliate) {
    localStorage.setItem('currentUserAffiliate', JSON.stringify(user));
    this.currentUserAffiliateSubject.next(user);
  }

  public setUserAdminValue(user: User) {
    localStorage.setItem('currentUserAdmin', JSON.stringify(user));
    this.currentUserAdminSubject.next(user);
  }

  getLoginMovementsByAffiliatedId(affiliateId: number) {
    return this.http
      .get<Response>(
        `${this.urlApi}/auth/login_movements/${affiliateId}`,
        httpOptions
      )
      .pipe(
        map((response) => {

          return response.data;
        })
      );
  }

  fetchIpAddress(): Observable<string> {
    return this.http
      .get<{ ip: string }>('https://api.ipify.org?format=json')
      .pipe(map((data) => data.ip));
  }
}
