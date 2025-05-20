import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { UserService } from '../../../services/user.service';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['username', 'email', 'area', 'rol', 'estado', 'acciones'];
  dataSource: MatTableDataSource<User>;
  users: User[] = [];
  filterForm: FormGroup;
  roles: string[] = ['Todos', 'admin', 'supervisor', 'user'];
  departamentos: string[] = ['Todos', 'Tecnología', 'Recursos Humanos', 'Finanzas', 'Marketing', 'Operaciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<User>([]);

    // Inicializar formulario de filtros
    this.filterForm = this.fb.group({
      searchTerm: [''],
      rol: ['Todos'],
      departamento: ['Todos']
    });
  }

  ngOnInit(): void {
    this.loadUsers();

    // Suscribirse a cambios en el formulario de filtros
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.dataSource.data = users;
    });
  }

  applyFilters(): void {
    const filterValue = this.filterForm.value;

    let filteredData = this.users;

    // Filtrar por término de búsqueda
    if (filterValue.searchTerm) {
      const searchTerm = filterValue.searchTerm.toLowerCase();
      filteredData = filteredData.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm) ||
        user.apellido.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por rol
    if (filterValue.rol !== 'Todos') {
      filteredData = filteredData.filter(user => user.rol === filterValue.rol);
    }

    // Filtrar por departamento
    if (filterValue.departamento !== 'Todos') {
      filteredData = filteredData.filter(user => user.departamento === filterValue.departamento);
    }

    this.dataSource.data = filteredData;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetFilters(): void {
    this.filterForm.reset({
      searchTerm: '',
      rol: 'Todos',
      departamento: 'Todos'
    });
    this.dataSource.data = this.users;
  }

  createUser(): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '600px',
      data: { isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.createUser(result).subscribe(
          newUser => {
            this.users.push(newUser);
            this.dataSource.data = [...this.users];
            this.showSnackbar('Usuario creado correctamente');
          },
          error => this.showSnackbar('Error al crear usuario')
        );
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '600px',
      data: { user: {...user}, isNew: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(result).subscribe(
          updatedUser => {
            const index = this.users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              this.users[index] = updatedUser;
              this.dataSource.data = [...this.users];
            }
            this.showSnackbar('Usuario actualizado correctamente');
          },
          error => this.showSnackbar('Error al actualizar usuario')
        );
      }
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar usuario',
        message: `¿Estás seguro de que deseas eliminar el usuario ${user.nombre} ${user.apellido}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id!).subscribe(
          () => {
            this.users = this.users.filter(u => u.id !== user.id);
            this.dataSource.data = [...this.users];
            this.showSnackbar('Usuario eliminado correctamente');
          },
          error => this.showSnackbar('Error al eliminar usuario')
        );
      }
    });
  }

  toggleUserStatus(user: User): void {
    const updatedUser = {...user, estado: !user.estado};

    this.userService.updateUser(updatedUser).subscribe(
      result => {
        const index = this.users.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.users[index] = result;
          this.dataSource.data = [...this.users];
        }
        // this.showSnackbar(`Usuario ${result.estado ? 'activado' : 'desactivado'} correctamente`);
      },
      error => this.showSnackbar('Error al actualizar estado del usuario')
    );
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000
    });
  }

  getRoleBadgeClass(rol: string): string {
    switch (rol) {
      case 'admin':
        return 'admin';
      case 'supervisor':
        return 'supervisor';
      default:
        return 'user';
    }
  }

  getRoleLabel(rol: string): string {
    switch (rol) {
      case 'admin':
        return 'Administrador';
      case 'supervisor':
        return 'Supervisor';
      default:
        return 'Usuario';
    }
  }
}
