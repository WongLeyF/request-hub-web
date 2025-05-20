import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { JwtService } from './jwt.service';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inicializar con valores predeterminados
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private jwtService: JwtService,
    private apiService: ApiService
  ) {
    // Mover la inicialización al constructor
    this.isLoggedInSubject.next(this.hasToken());
    this.currentUserSubject.next(this.getUserFromToken());
  }

  // Observable público para suscribirse a cambios en el usuario actual
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  // Obtener usuario actual de forma síncrona
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

    login(username: string, password: string): Observable<any> {
    return this.apiService.post('auth/signin', { username, password }).pipe(
      tap((response: any) => {
        if (response && response.accessToken) {
          this.jwtService.saveToken(response.accessToken);
          this.isLoggedInSubject.next(true);

          // Actualizar el usuario actual con los datos del token
          const userData = this.getUserFromToken();
          this.currentUserSubject.next(userData);
        }
      }),
      catchError((error: any) => {
        console.error('Error de autenticación', error);
        this.isLoggedInSubject.next(false);
        this.currentUserSubject.next(null);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.jwtService.destroyToken();
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Método para verificar si el token actual es válido
  isTokenValid(): boolean {
    const payload = this.jwtService.decodeToken();

    if (!payload) {
      return false;
    }

    // Verificar si el token ha expirado
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(payload.exp);
    const isExpired = expirationDate.valueOf() < new Date().valueOf();

    return !isExpired;
  }

  private hasToken(): boolean {
    return !!this.jwtService.getToken();
  }

  // Método para extraer los datos del usuario del token
  private getUserFromToken(): User | null {
    const payload = this.jwtService.decodeToken();
    if (!payload) {
      return null;
    }

    // Mapear los datos del payload a un objeto User
    return {
      id: parseInt(payload.id),
      username: payload.sub || '',
      nombre: payload.nombre || '',
      apellido: payload.apellido || '',
      areaId: payload.areaId || null,
      email: payload.email || '',
      rol: payload.rol || 'user',
      departamento: payload.departamento || '',
      cargo: payload.cargo || '',
      estado: true,
      area: payload.area || '',
      avatarUrl: 'https://i.pravatar.cc/300?u=john.doe', // URL de la imagen del avatar
    };
  }
}
