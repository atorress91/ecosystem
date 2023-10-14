import { BehaviorSubject, Observable } from "rxjs";

export class UserDataService {

  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {

  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }
}
