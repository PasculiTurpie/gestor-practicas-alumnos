# 📚 Gestión de Prácticas Profesionales (MERN)

Sistema web para administrar el proceso de **prácticas profesionales** en una institución académica.  
Construido con el stack **MERN** (MongoDB, Express.js, React, Node.js).

---

## 🎯 Objetivo

Permitir registrar a los estudiantes en práctica y gestionar el avance por **8 etapas** del proceso:

1. Recopilación de información / Preparación de carpeta  
2. Entrega de carpeta  
3. Encuesta CP  
4. Envío de portafolio tipo e instrucciones  
5. Supervisión de prácticas  
6. Envío de borrador de portafolio  
7. Subir portafolio a aula  
8. Nota final y cierre de práctica  

Cada práctica queda trazada en un **historial de etapas** con fecha, notas y responsable.

---

## 🖥️ Frontend (React + Vite)

El **frontend** está desarrollado en **React** (con Vite) y CSS puro.  
Ofrece una interfaz sencilla y moderna para interactuar con la API del backend.

### Funcionalidades principales

- **Navbar fija** con acceso a:
  - Dashboard
  - Alumnos
  - Prácticas
- **Dashboard**:
  - Vista rápida de las últimas prácticas actualizadas.
  - Badges con íconos para identificar la etapa actual.
- **Gestión de Alumnos**:
  - Formulario de registro (nombre, RUT, correos, NRC, celular, centro de prácticas, observaciones).
  - Listado de alumnos con tabla estilizada.
  - Búsqueda por texto y paginación.
  - Ordenamiento de columnas (nombre, RUT, NRC, correo, celular, centro).
  - Exportar listado de alumnos a **CSV**.
- **Gestión de Prácticas**:
  - Tabla con alumnos, centro de práctica y etapa actual.
  - Filtros por etapa y búsqueda por alumno/centro.
  - Ordenamiento de columnas.
  - Avanzar la práctica a la siguiente etapa mediante modal.
  - Exportar listado de prácticas a **CSV**.
- **UI/UX**:
  - Estilos globales en CSS puro (sin frameworks externos).
  - Diseño responsive (funciona en escritorio y móvil).
  - Badges coloridas con íconos para cada etapa.
  - Modales ligeros para avanzar etapas.

---

## ⚙️ Backend (Express + MongoDB)

- API REST con Express.js.
- Modelos en MongoDB (Mongoose) para **Student** y **Practice**.
- Validaciones con **Zod** y validador de **RUT chileno**.
- Endpoints para CRUD de alumnos y prácticas, y avance de etapas.
- Historial de etapas guardado automáticamente.

---

## 📂 Estructura del proyecto

