import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestType, ApprovalStage, Area } from '../models/request-type.model';
// import { environment } from '../../environments/environment';

const environment = {
  apiUrl: 'http://localhost:3000/api'
};

@Injectable({
  providedIn: 'root'
})
export class RequestTypeService {
  private apiUrl = `${environment.apiUrl}/request-types`;
  private areasUrl = `${environment.apiUrl}/areas`;

  // constructor(private http: HttpClient) { }
  private mockedRequestTypes: RequestType[] = [
    {
      id: 1,
      nombre: 'Solicitud de Permiso',
      descripcion: 'Solicitud para permisos de ausencia',
      activo: true,
      stages: [
        { id: 1, request_type_id: 1, rol: 'admin', area_id: 1, etapa: 1 },
        { id: 2, request_type_id: 1, rol: 'supervisor', area_id: 2, etapa: 2 }
      ]
    }
  ];

  getRequestTypes(): Observable<RequestType[]> {
    // return this.http.get<RequestType[]>(this.apiUrl).pipe(
    //   catchError(this.handleError<RequestType[]>('getRequestTypes', []))
    // );
    return of(this.mockedRequestTypes);
  }

  getRequestTypeById(id: number): Observable<RequestType> {
    // return this.http.get<RequestType>(`${this.apiUrl}/${id}`).pipe(
    //   catchError(this.handleError<RequestType>(`getRequestType id=${id}`))
    // );
    const requestType = this.mockedRequestTypes.find(rt => rt.id === id);
    return of(this.mockedRequestTypes[0]);
  }

  getApprovalStages(requestTypeId: number): Observable<ApprovalStage[]> {
    // return this.http.get<ApprovalStage[]>(`${this.apiUrl}/${requestTypeId}/stages`).pipe(
    //   catchError(this.handleError<ApprovalStage[]>('getApprovalStages', []))
    // );
    const stages = this.mockedRequestTypes.find(rt => rt.id === requestTypeId)?.stages || [];
    return of(stages);
  }

  getAreas(): Observable<Area[]> {
    // return this.http.get<Area[]>(this.areasUrl).pipe(
    //   catchError(this.handleError<Area[]>('getAreas', []))
    // );
    const areas: Area[] = [
      { id: 1, nombre: 'Recursos Humanos', descripcion: 'Gestión de personal' },
      { id: 2, nombre: 'Tecnología', descripcion: 'Soporte técnico' }
    ];
    return of(areas);
  }

  createRequestType(requestType: RequestType): Observable<RequestType> {
    // return this.http.post<RequestType>(this.apiUrl, requestType).pipe(
    //   catchError(this.handleError<RequestType>('createRequestType'))
    // );
    const newRequestType = { ...requestType, id: this.mockedRequestTypes.length + 1 };
    this.mockedRequestTypes.push(newRequestType);
    return of(newRequestType);
  }

  updateRequestType(requestType: RequestType): Observable<RequestType> {
    // return this.http.put<RequestType>(`${this.apiUrl}/${requestType.id}`, requestType).pipe(
    //   catchError(this.handleError<RequestType>('updateRequestType'))
    // );
    const index = this.mockedRequestTypes.findIndex(rt => rt.id === requestType.id);
    if (index !== -1) {
      this.mockedRequestTypes[index] = { ...this.mockedRequestTypes[index], ...requestType };
    }
    return of(this.mockedRequestTypes[index]);
  }

  deleteRequestType(id: number): Observable<any> {
    // return this.http.delete(`${this.apiUrl}/${id}`).pipe(
    //   catchError(this.handleError<any>('deleteRequestType'))
    // );
    const index = this.mockedRequestTypes.findIndex(rt => rt.id === id);
    if (index !== -1) {
      this.mockedRequestTypes.splice(index, 1);
    }
    return of({ message: 'Tipo de solicitud eliminado' });
  }

  saveApprovalStages(requestTypeId: number, stages: ApprovalStage[]): Observable<ApprovalStage[]> {
    // return this.http.post<ApprovalStage[]>(`${this.apiUrl}/${requestTypeId}/stages`, stages).pipe(
    //   catchError(this.handleError<ApprovalStage[]>('saveApprovalStages'))
    // );
    const requestType = this.mockedRequestTypes.find(rt => rt.id === requestTypeId);
    if (requestType) {
      requestType.stages = stages.map((stage, index) => ({
        ...stage,
        id: index + 1,
        request_type_id: requestTypeId,
        etapa: index + 1
      }));
    }
    return of(requestType?.stages || []);
  }

  deleteApprovalStage(stageId: number): Observable<any> {
    // return this.http.delete(`${this.apiUrl}/stages/${stageId}`).pipe(
    //   catchError(this.handleError<any>('deleteApprovalStage'))
    // );
    const requestType = this.mockedRequestTypes.find(rt => rt.stages?.some(s => s.id === stageId));
    if (requestType) {
      requestType.stages = requestType.stages?.filter(s => s.id !== stageId);
    }
    return of({ message: 'Etapa de aprobación eliminada' });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Devolver un resultado vacío para seguir ejecutando la aplicación
      return of(result as T);
    };
  }
}
