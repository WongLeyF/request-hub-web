import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private mockRequests: any[] = [
    {
      id: 'REQ-2025-001',
      subject: 'Solicitud de equipos informáticos',
      type: 'purchase',
      status: 'pending',
      createdAt: new Date('2025-05-15T10:30:00'),
      priority: 'medium',
      description: 'Necesito 3 laptops para el nuevo equipo de desarrollo. Las especificaciones requeridas son:\n\n- Procesador i7 o superior\n- 16GB RAM\n- 512GB SSD\n- Pantalla 15"\n\nSe necesitan para la próxima semana ya que el equipo nuevo se incorpora el lunes.',
      creator: 'Ana Rodríguez',
      creatorId: 1,
      creatorDepartment: 'Tecnología',
      creatorAvatar: 'https://i.pravatar.cc/300?u=ana',
      approvalHistory: [
        {
          id: 1,
          approverName: 'Carlos Méndez',
          approverRole: 'Supervisor TI',
          status: 'approved',
          date: new Date('2025-05-16T14:30:00'),
          comments: 'Aprobado. Las laptops son necesarias para el nuevo equipo.',
          avatarUrl: 'https://i.pravatar.cc/300?u=carlos'
        }
      ],
      comments: [
        {
          id: 1,
          userName: 'Laura Jiménez',
          userRole: 'Recursos Humanos',
          text: '¿Podrías especificar para qué departamento son estas laptops?',
          date: new Date('2025-05-15T11:45:00'),
          avatarUrl: 'https://i.pravatar.cc/300?u=laura'
        },
        {
          id: 2,
          userName: 'Ana Rodríguez',
          userRole: 'Gerente de Proyectos',
          text: 'Son para el nuevo equipo de desarrollo frontend que se incorpora la próxima semana.',
          date: new Date('2025-05-15T12:10:00'),
          avatarUrl: 'https://i.pravatar.cc/300?u=ana'
        }
      ]
    },
    {
      id: 'REQ-2025-002',
      subject: 'Viaje a conferencia de desarrollo',
      type: 'travel',
      status: 'approved',
      createdAt: new Date('2025-05-10T15:20:00'),
      priority: 'low',
      description: 'Solicitud para asistir a la conferencia Angular Connect en Londres del 15 al 18 de junio. Se requiere aprobación para vuelo, hotel y gastos asociados.',
      creator: 'Carlos Méndez',
      creatorId: 2,
      creatorDepartment: 'Desarrollo',
      creatorAvatar: 'https://i.pravatar.cc/300?u=carlos',
      approvalHistory: [
        {
          id: 1,
          approverName: 'Miguel Sánchez',
          approverRole: 'Director de Tecnología',
          status: 'approved',
          date: new Date('2025-05-12T09:15:00'),
          comments: 'Aprobado. Es importante mantenernos actualizados en Angular.',
          avatarUrl: 'https://i.pravatar.cc/300?u=miguel'
        }
      ],
      comments: []
    },
    {
      id: 'REQ-2025-003',
      subject: 'Licencia por estudios',
      type: 'leave',
      status: 'rejected',
      createdAt: new Date('2025-05-08T09:15:00'),
      priority: 'high',
      description: 'Solicito una semana de licencia para asistir a un curso intensivo',
      creator: 'Laura Jiménez'
    },
    {
      id: 'REQ-2025-004',
      subject: 'Reembolso de gastos de representación',
      type: 'expense',
      status: 'returned',
      createdAt: new Date('2025-05-05T11:45:00'),
      priority: 'medium',
      description: 'Gastos incurridos durante la reunión con el cliente XYZ',
      creator: 'Miguel Sánchez'
    },
    {
      id: 'REQ-2025-005',
      subject: 'Actualizacion licencia software',
      type: 'purchase',
      status: 'pending',
      createdAt: new Date('2025-05-03T14:20:00'),
      priority: 'urgent',
      description: 'Renovación urgente de licencias de Adobe Creative Suite',
      creator: 'Sofía Torres',
      dueDate: new Date('2025-05-25')
    },
    {
      id: 'REQ-2025-006',
      subject: 'Viaje a sede central',
      type: 'travel',
      status: 'approved',
      createdAt: new Date('2025-04-28T16:30:00'),
      priority: 'medium',
      description: 'Visita a sede central para reunión estratégica trimestral',
      creator: 'Ana Rodríguez'
    },
    {
      id: 'REQ-2025-007',
      subject: 'Reembolso de curso online',
      type: 'expense',
      status: 'approved',
      createdAt: new Date('2025-04-25T10:10:00'),
      priority: 'low',
      description: 'Solicito reembolso del curso de especialización en Angular',
      creator: 'Carlos Méndez'
    }
  ];

  constructor() { }

  getRequests(): Observable<any[]> {
    // En una implementación real, esto sería una llamada HTTP
    return of(this.mockRequests);
  }

  getRequestById(id: string): Observable<any | undefined> {
    const request = this.mockRequests.find(req => req.id === id);
    return of(request);
  }

  updateRequestStatus(requestId: string, newStatus: string, comments: string): Observable<any> {
    // Simulación de actualización del estado
    const requestIndex = this.mockRequests.findIndex(req => req.id === requestId);

    if (requestIndex !== -1) {
      this.mockRequests[requestIndex].status = newStatus;

      // Añadir al historial de aprobaciones
      this.mockRequests[requestIndex].approvalHistory.push({
        id: this.mockRequests[requestIndex].approvalHistory.length + 1,
        approverName: 'Usuario Actual', // En una app real, usaríamos datos del usuario actual
        approverRole: 'Supervisor',
        status: newStatus,
        date: new Date(),
        comments: comments,
        avatarUrl: 'https://i.pravatar.cc/300?u=current'
      });
    }

    return of({ success: true });
  }

  addComment(requestId: string, commentText: string): Observable<any> {
    // Simulación de añadir un comentario
    const requestIndex = this.mockRequests.findIndex(req => req.id === requestId);

    if (requestIndex !== -1) {
      this.mockRequests[requestIndex].comments.push({
        id: this.mockRequests[requestIndex].comments.length + 1,
        userName: 'Usuario Actual', // En una app real, usaríamos datos del usuario actual
        userRole: 'Supervisor',
        text: commentText,
        date: new Date(),
        avatarUrl: 'https://i.pravatar.cc/300?u=current'
      });
    }

    return of({ success: true });
  }

  getRequestsStatistics(): Observable<any> {
    // Calcular estadísticas
    const total = this.mockRequests.length;
    const pending = this.mockRequests.filter(req => req.status === 'pending').length;
    const approved = this.mockRequests.filter(req => req.status === 'approved').length;
    const rejected = this.mockRequests.filter(req => req.status === 'rejected').length;

    return of({
      total,
      pending,
      approved,
      rejected
    });
  }

  cancelRequest(id: string): Observable<void> {
    const index = this.mockRequests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.mockRequests[index].status = 'canceled';
    }
    return of(void 0);
  }

  getRecentActivities(): Observable<any[]> {
    // Datos para el feed de actividad en el dashboard
    const mockActivities = [
      {
        id: 1,
        type: 'created',
        user: 'Carlos Méndez',
        message: 'Creó una nueva solicitud de compra para equipos informáticos',
        timestamp: new Date(2025, 4, 20, 10, 30),
        requestId: 'REQ-2025-001',
        status: 'Pendiente'
      },
      {
        id: 2,
        type: 'approved',
        user: 'Laura Jiménez',
        message: 'Aprobó tu solicitud de reembolso de gastos de viaje',
        timestamp: new Date(2025, 4, 20, 9, 15),
        requestId: 'REQ-2025-007',
        status: 'Aprobada'
      }
      // ...otras actividades
    ];

    return of(mockActivities);
  }

  getPendingApprovalsForSupervisor(): Observable<any[]> {
    // Simulamos obtener solo solicitudes pendientes
    const pendingRequests = this.mockRequests
      .filter(req => req.status === 'pending')
      .map(req => ({
        ...req,
        area: req.creatorDepartment || 'Sin asignar',
        expanded: false
      }));

    return of(pendingRequests);
  }
}
