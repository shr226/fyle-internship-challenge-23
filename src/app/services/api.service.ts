import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private cache: Map<string, any> = new Map();

  constructor(private httpClient: HttpClient) {}

  getUser(githubUsername: string): Observable<any> {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`).pipe(
      tap(data => console.log('User data:', data)),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return throwError(error);
      })
    );
  }

  searchUsers(username: string): Observable<any> {
    return this.httpClient.get(`https://api.github.com/search/users?q=${username}+in:login`).pipe(
      tap(data => console.log('Search Users data:', data)),
      catchError(error => {
        console.error('Error fetching search users data:', error);
        return throwError(error);
      })
    );
  }

  getRepositories(username: string, page: number, pageSize: number): Observable<any> {
    const cacheKey = `${username}-${page}-${pageSize}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    } else {
      const url = `https://api.github.com/search/repositories?q=user:${username}&page=${page}&per_page=${pageSize}`;
      return this.httpClient.get(url).pipe(
        tap(data => {
          console.log('Repositories data:', data);
          this.cache.set(cacheKey, data);
        }),
        map(data => data),
        catchError(error => {
          console.error('Error fetching repositories:', error);
          return throwError(error);
        })
      );
    }
  }
}


