# RequestHub

RequestHub es una aplicación web desarrollada con Angular que permite gestionar solicitudes, aprobaciones y reportes en un entorno empresarial.

## Requisitos previos

- [Node.js](https://nodejs.org/) (v18.x o superior)
- [npm](https://www.npmjs.com/) (v9.x o superior)
- [Angular CLI](https://angular.dev/tools/cli) (v19.2.x)

## Instalación

1. Clona este repositorio o descarga el código fuente:

```bash
git clone <URL-del-repositorio>
cd request-hub
```
2. Instala las dependencias del proyecto:

```bash
npm install
```

## Ejecución local
Para ejecutar la aplicación en modo de desarrollo, utiliza el siguiente comando:

```bash
ng serve
```
Esto iniciará un servidor de desarrollo y podrás acceder a la aplicación en `http://localhost:4200/`.

## Construcción
Para construir la aplicación para producción, utiliza el siguiente comando:

```bash
ng build --prod
```
Esto generará los archivos de producción en la carpeta `dist/`.
Puedes servir estos archivos utilizando un servidor web estático o desplegarlos en un servidor de tu elección.

## Estructura del proyecto
La estructura del proyecto sigue las convenciones de Angular y está organizada de la siguiente manera:

```bash
request-hub/
├── .angular/            # Archivos de caché de Angular
├── .vscode/             # Configuración de VS Code
├── src/
│   ├── app/
│   │   ├── app.component.*      # Componente raíz
│   │   ├── app.config.ts        # Configuración de la aplicación
│   │   ├── app.routes.ts        # Configuración de rutas
│   │   ├── guards/              # Guards de rutas
│   │   ├── layouts/             # Componentes de estructura
│   │   │   └── main-layout/     # Layout principal con menú lateral
│   │   ├── models/              # Interfaces y modelos de datos
│   │   ├── pages/               # Páginas principales
│   │   │   ├── admin/           # Sección de administración
│   │   │   │   └── user-management/
│   │   │   ├── auth/            # Autenticación
│   │   │   │   └── login/       # Página de inicio de sesión
│   │   │   ├── reports/         # Generación de reportes
│   │   │   └── requests/        # Gestión de solicitudes
│   │   │       ├── request-detail/
│   │   │       └── request-list/
│   │   ├── services/            # Servicios de la aplicación
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.service.ts
│   │   │   └── reports.service.ts
│   │   └── shared/              # Componentes compartidos
│   ├── assets/                  # Recursos estáticos
│   ├── environments/            # Configuraciones por entorno
│   ├── index.html               # Archivo HTML principal
│   ├── main.ts                  # Punto de entrada principal
│   └── styles.scss              # Estilos globales
├── angular.json                 # Configuración de Angular
├── package.json                 # Dependencias y scripts
├── README.md                    # Este archivo
├── tsconfig.json                # Configuración de TypeScript
└── tsconfig.app.json            # Configuración de TS para la app
```

## Características principales

- **Gestión de solicitudes**: Permite a los usuarios crear, editar y eliminar solicitudes.
- **Gestión de usuarios**: Administración de cuentas de usuario
- **Gestión de solicitudes**: Creación y seguimiento de solicitudes
- **Aprobaciones**: Flujos de aprobación para solicitudes
- **Reportes**: Generación de informes con diferentes filtros y visualizaciones
- **Autenticación**: Sistema de login y control de acceso

## Tecnologías utilizadas
- **Angular**: Framework para construir aplicaciones web de una sola página.
- **TypeScript**: Lenguaje de programación que se compila a JavaScript.
- **Bootstrap**: Framework CSS para diseño responsivo.
- **RxJS**: Biblioteca para programación reactiva con observables.
- **NgRx**: Librería para manejar el estado de la aplicación.
- **Angular Material**: Componentes de UI para Angular.
- **Chart.js / ng2-charts**: Librería para gráficos y visualizaciones de datos.
