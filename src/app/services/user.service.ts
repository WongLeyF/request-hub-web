import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';
// import { environment } from '../../environments/environment';

const environment = {
  apiUrl: 'http://localhost:3000/api'
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  // constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<any | null> {
    // mocked user data
    const user: any = {
      id: 1,
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@empresa.com',
      role: 'Gerente de Proyectos',
      department: 'Tecnología',
      avatarUrl: 'https://i.pravatar.cc/300?u=ana'
    };

    return of(user);
    // return this.http.get<User>(`${this.apiUrl}/current`).pipe(
    //   catchError(this.handleError<User>('getCurrentUser', null))
    // );
  }

  getUsers(): Observable<User[]> {
    // return this.http.get<User[]>(this.apiUrl).pipe(
    //   catchError(this.handleError<User[]>('getUsers', []))
    // );
    const users: any[] = [
      {
      id: 1,
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@empresa.com',
      role: 'Gerente de Proyectos',
      department: 'Tecnología',
      avatarUrl: 'https://i.pravatar.cc/300?u=ana'
    }
    ];
    return of(users);
  }

  getUserById(id: number): Observable<User> {
    // return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
    //   catchError(this.handleError<User>(`getUser id=${id}`))
    // );
    const user: any = {
      id: 1,
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@empresa.com',
      role: 'Gerente de Proyectos',
      department: 'Tecnología',
      avatarUrl: 'https://i.pravatar.cc/300?u=ana'
    };

    return of(user);
  }

  createUser(user: User): Observable<User> {
    // return this.http.post<User>(this.apiUrl, user).pipe(
    //   catchError(this.handleError<User>('createUser'))
    // );
    return of(user);
  }

  updateUser(user: User): Observable<User> {
    // return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
    //   catchError(this.handleError<User>('updateUser'))
    // );
    return of(user);
  }

  deleteUser(id: number): Observable<any> {
    // return this.http.delete(`${this.apiUrl}/${id}`).pipe(
    //   catchError(this.handleError<any>('deleteUser'))
    // );
    return of(null);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Devolver un resultado vacío para seguir ejecutando la aplicación
      return of(result as T);
    };
  }
}
