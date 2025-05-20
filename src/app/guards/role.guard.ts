import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Obtener los roles requeridos de los datos de la ruta
    const requiredRoles = route.data['roles'] as Array<string>;

    // En un caso real, obtendrías el rol del usuario del token o de un servicio
    const userRoles = this.getUserRoles();

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    if (userRoles.some(role => requiredRoles.includes(role))) {
      return true;
    }

    // Redirigir a una página de acceso denegado
    return this.router.parseUrl('/unauthorized');
  }

  private getUserRoles(): string[] {
    // Aquí obtendrías los roles del usuario desde el token JWT o desde un servicio
    // Este es un ejemplo simplificado
    return ['admin'];
  }
}
