import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private tokenKey = 'token';

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  destroyToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Método para decodificar el payload del token JWT
  decodeToken(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      // Verificar que el token tenga el formato esperado (al menos header.payload)
      const parts = token.split('.');
      if (parts.length < 2) {
        console.error('Token JWT inválido: formato incorrecto');
        return null;
      }

      const base64Payload = parts[1];
      // Decodificar y convertir a JSON
      const payload = JSON.parse(
        atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'))
      );
      return payload;
    } catch (error) {
      console.error('Error decodificando token JWT:', error);
      return null;
    }
  }
}
