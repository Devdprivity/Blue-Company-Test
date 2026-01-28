# Evaluación Técnica - Desarrollador Fullstack

Aplicación para gestionar **Proyectos, Tareas y Comentarios** desarrollada con Laravel 11 y Angular 17.

## Tecnologías Utilizadas

| Backend | Frontend |
|---------|----------|
| Laravel 11 | Angular 17 |
| PHP 8.3 | TypeScript |
| PostgreSQL | RxJS |
| Laravel Sanctum | Angular Signals |

---

## Instalación y Ejecución

### Requisitos Previos
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL (o MySQL/SQLite)

### Backend

```bash
cd backend
composer install
cp .env.example .env
```

Configurar `.env` con los datos de tu base de datos:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=bluecompany
DB_USERNAME=postgres
DB_PASSWORD=tu_password
```

Ejecutar:
```bash
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

### Acceso

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8000/api |

### Credenciales de Prueba

| Campo | Valor |
|-------|-------|
| **Email** | `admin@example.com` |
| **Password** | `password` |

---

## Estructura del Proyecto

### Backend (Clean Architecture)
```
backend/
├── app/
│   ├── Domain/                 # Enums (ProjectStatus, TaskStatus, TaskPriority)
│   ├── Application/Services/   # Lógica de negocio
│   ├── Infrastructure/         # Repositorios
│   ├── Http/
│   │   ├── Controllers/        # API Controllers
│   │   ├── Requests/           # Validación
│   │   ├── Resources/          # Transformación JSON
│   │   └── Policies/           # Autorización
│   └── Models/                 # Eloquent Models
├── database/
│   ├── migrations/             # Estructura de BD
│   └── seeders/                # Datos de prueba
└── routes/api.php              # Rutas API
```

### Frontend
```
frontend/src/app/
├── core/
│   ├── services/       # AuthService, TaskService, ProjectService, CommentService
│   ├── guards/         # authGuard, guestGuard
│   ├── interceptors/   # authInterceptor (agrega Bearer token)
│   └── models/         # Interfaces TypeScript
└── features/
    ├── auth/           # Login, Register
    ├── tasks/          # TaskList, TaskDetail
    └── projects/       # ProjectList
```

---

## Reglas de Negocio Implementadas

### 1. Completar Proyecto → Finalizar Tareas
Cuando un proyecto cambia a estado "completado", todas sus tareas se actualizan automáticamente a "finalizada".

**Implementación:** `app/Application/Services/ProjectService.php`
```php
public function complete(Project $project): Project
{
    return DB::transaction(function () use ($project) {
        $this->taskRepository->finalizeByProject($project->id);
        return $this->projectRepository->update($project, [
            'estado' => ProjectStatus::COMPLETADO->value
        ]);
    });
}
```

### 2. Permisos de Proyecto
Solo el owner puede crear, editar o eliminar tareas de su proyecto.

**Implementación:** `app/Policies/TaskPolicy.php`
```php
public function update(User $user, Task $task): bool
{
    return $task->project->isOwner($user);
}
```

### 3. Comentarios
Cualquier usuario autenticado puede agregar comentarios a cualquier tarea.

---

## API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/register` | Registro de usuario |
| POST | `/api/login` | Inicio de sesión (retorna token) |
| POST | `/api/logout` | Cerrar sesión |
| GET | `/api/me` | Usuario actual |

### Proyectos (requiere autenticación)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/projects` | Listar proyectos del usuario |
| POST | `/api/projects` | Crear proyecto |
| GET | `/api/projects/{id}` | Ver proyecto |
| PUT | `/api/projects/{id}` | Actualizar proyecto |
| DELETE | `/api/projects/{id}` | Eliminar proyecto |
| PUT | `/api/projects/{id}/complete` | Completar proyecto (finaliza tareas) |

### Tareas (requiere autenticación)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks` | Listar tareas con filtros |
| POST | `/api/tasks` | Crear tarea |
| GET | `/api/tasks/{id}` | Ver tarea |
| PUT | `/api/tasks/{id}` | Actualizar tarea |
| DELETE | `/api/tasks/{id}` | Eliminar tarea |

**Filtros disponibles:** `?project_id=1&estado=pendiente&prioridad=alta&page=1&per_page=15`

### Comentarios (requiere autenticación)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks/{id}/comments` | Listar comentarios de una tarea |
| POST | `/api/tasks/{id}/comments` | Agregar comentario a una tarea |

---

## Justificación del Índice en la Base de Datos

Se creó un **índice compuesto** en la tabla `tasks`:

```sql
CREATE INDEX tasks_project_id_estado_prioridad_index
ON tasks (project_id, estado, prioridad);
```

### ¿Por qué este índice?

1. **Optimiza los filtros combinados**: El frontend permite filtrar tareas por proyecto, estado y prioridad simultáneamente. Este índice acelera estas consultas frecuentes.

2. **Orden de columnas estratégico**:
   - `project_id` primero: mayor selectividad, usado en JOINs
   - `estado` segundo: filtro frecuente
   - `prioridad` tercero: filtro adicional

3. **Cobertura de consultas**: El índice es útil para:
   - `WHERE project_id = ?`
   - `WHERE project_id = ? AND estado = ?`
   - `WHERE project_id = ? AND estado = ? AND prioridad = ?`

4. **Mejora JOINs**: Al tener `project_id` como primera columna, optimiza las consultas que relacionan tareas con proyectos.

---

## Consultas SQL Solicitadas

### 1. Listar Proyectos con cantidad total de tareas asociadas

```sql
SELECT
    p.id,
    p.nombre,
    p.estado,
    p.owner_id,
    COUNT(t.id) AS total_tareas
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id
GROUP BY p.id, p.nombre, p.estado, p.owner_id
ORDER BY p.id;
```

### 2. Listar Tareas agrupadas por prioridad y estado

```sql
SELECT
    prioridad,
    estado,
    COUNT(*) AS cantidad
FROM tasks
GROUP BY prioridad, estado
ORDER BY
    CASE prioridad
        WHEN 'alta' THEN 1
        WHEN 'media' THEN 2
        WHEN 'baja' THEN 3
    END,
    CASE estado
        WHEN 'pendiente' THEN 1
        WHEN 'en_progreso' THEN 2
        WHEN 'finalizada' THEN 3
    END;
```

### 3. Listar Usuarios con la cantidad de proyectos que administran

```sql
SELECT
    u.id,
    u.nombre,
    u.email,
    COUNT(p.id) AS total_proyectos
FROM users u
LEFT JOIN projects p ON p.owner_id = u.id
GROUP BY u.id, u.nombre, u.email
ORDER BY total_proyectos DESC;
```

---

## Modelo de Datos

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Users     │       │  Projects   │       │    Tasks    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │──┐    │ id          │──┐    │ id          │
│ nombre      │  │    │ nombre      │  │    │ titulo      │
│ email       │  │    │ estado      │  │    │ prioridad   │
│ password    │  └───►│ owner_id    │  └───►│ estado      │
└─────────────┘       └─────────────┘       │ project_id  │
       │                                    └─────────────┘
       │                                           │
       │              ┌─────────────┐               │
       │              │  Comments   │               │
       │              ├─────────────┤               │
       └─────────────►│ id          │◄──────────────┘
                      │ cuerpo      │
                      │ user_id     │
                      │ task_id     │
                      └─────────────┘
```

### Campos por Entidad

| Usuario | Proyecto | Tarea | Comentario |
|---------|----------|-------|------------|
| nombre | nombre (3-120 chars) | titulo (3-150 chars) | cuerpo (texto) |
| email (unique) | estado | prioridad | task_id (FK) |
| password (hash) | owner_id (FK) | estado | user_id (FK) |
| | | project_id (FK) | |

### Estados y Prioridades

| Proyecto.estado | Tarea.estado | Tarea.prioridad |
|-----------------|--------------|-----------------|
| nuevo | pendiente | baja |
| en_progreso | en_progreso | media |
| completado | finalizada | alta |

---

## Funcionalidades del Frontend

| Funcionalidad | Descripción |
|---------------|-------------|
| **Login** | Autenticación con email y contraseña |
| **Lista de Tareas** | Con filtros por proyecto, estado y prioridad |
| **Paginación Real** | Paginación desde el servidor (no en memoria) |
| **Detalle de Tarea** | Muestra información completa y comentarios |
| **Agregar Comentarios** | Formulario en el detalle de tarea |
| **Gestión de Proyectos** | CRUD completo con acción "Completar" |
