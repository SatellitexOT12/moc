# Plataforma MOOC - Frontend + Backend

Plataforma de cursos MOOC con sistema de matrícula, autenticación de usuarios y exportación de datos a CSV.

Esta aplicación está construida con:
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Django + Django REST Framework
- **Conexión a Moodle**: A través de Web Services API

---

## ✅ Características

- 📚 Listado de cursos desde Moodle
- 🔐 Inicio y registro de usuarios local
- 👤 Perfil de usuario con campos personalizados (edad, país, propósito)
- 📥 Matrícula disponible solo durante una ventana de tiempo: 1 semana antes del curso
- 📁 Exportar listado de usuarios matriculados a CSV (solo superusuarios)
- 🎬 Reproducir videos incrustados desde los resúmenes de cursos
- 📱 Diseño responsive para móviles y tablets

---

## 🧰 Requisitos

### Backend (Django)
- Python 3.8+
- Django 4.x
- Django REST Framework
- django-cors-headers
- requests
- dotenv
- MySQL o SQLite

### Frontend (React)
- Node.js 16.x o superior
- npm o yarn
- Tailwind CSS configurado

---

