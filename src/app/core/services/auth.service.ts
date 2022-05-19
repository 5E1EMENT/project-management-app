import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, mergeMap, Observable, tap } from 'rxjs';
import { ISignup, IToken, IUser } from '../../auth/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public token: string | null;
  public userId: string | null = '';
  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('token')
      ? localStorage.getItem('token')
      : '';

    if (localStorage.getItem('token')) {
      this.isLogged.next(true);
    }
  }
  public checkToken(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/boards']);
      this.isLogged.next(true);
    } else {
      this.router.navigate(['/welcome']);
    }
  }
  public delete(): Observable<any> {
    return this.http
      .delete(`users/${localStorage.getItem('id')}`)
      .pipe(map(() => localStorage.removeItem('id')));
  }
  public update(data: IUser): Observable<any> {
    return this.http.put(`users/${localStorage.getItem('id')}`, data).pipe(
      map((data: any) => {
        localStorage.setItem('id', data.id);
      })
    );
  }
  public signup(data: IUser): Observable<any> {
    return this.http.post<ISignup>('signup', data).pipe(
      tap((data: ISignup) => {
        this.saveUserId(data.id);
      }),
      mergeMap(() =>
        this.http.post<IToken>('signin', {
          login: data.login,
          password: data.password,
        })
      ),
      map((data: IToken) => data.token)
    );
  }
  public signin(data: IUser): Observable<any> {
    return this.http
      .post<IToken>('signin', data)
      .pipe(map((data: IToken) => data.token));
  }
  public saveToken(token: string) {
    this.isLogged.next(true);
    this.token = token;
    localStorage.setItem('token', token);
  }
  private saveUserId(userId: string) {
    this.userId = userId;
    localStorage.setItem('userId', userId);
  }
  public logout(): void {
    localStorage.removeItem('token');
    this.isLogged.next(false);
    this.token = '';
    this.router.navigate(['/welcome']);
  }

  public getUserToken(): string {
    return String(this.token);
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  public getUserId(): string | null {
    return this.userId ? this.userId : localStorage.getItem('userId');
  }

  /* getUsers(){
    return this.http.get('/api/users', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
  }

  getUser(id: string){
    return this.http.get(`/api/users/${id}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
  } */
}
