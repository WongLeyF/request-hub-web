import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

// Interfaz que deben implementar los componentes que usen este guard
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {

  canDeactivate(
    component: ComponentCanDeactivate
  ): Observable<boolean> | boolean {
    // Si el componente tiene el método canDeactivate, lo usamos
    if (component.canDeactivate) {
      const result = component.canDeactivate();

      // Si es un observable, lo retornamos directamente
      if (result instanceof Observable) {
        return result;
      }

      // Si es un booleano, lo retornamos
      return result;
    }

    // Si no tiene el método, permitimos la navegación
    return true;
  }
}
