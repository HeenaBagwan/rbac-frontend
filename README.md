# RBAC System - Frontend

This is the **frontend** of the Role-Based Access Control (RBAC) system.  
It is built using **React**, **Vite**, and **Redux**, and communicates with the backend API for authentication, role management, and permission-based access.

## Features

- User authentication (login/logout)
- Role-based access control
- Dynamic rendering of UI based on user permissions
- CRUD operations for roles (Create, View, Update, Delete)
- Modern responsive design using React

## Technologies

- React 18
- Vite
- Redux Toolkit
- Axios
- React Router
- React Icons

## Project Structure

frontend/
├── src/
│ ├── api/ # Axios API instance
│ ├── components/ # Reusable components (Navbar, Modals, etc.)
│ ├── pages/ # Pages (RolesPage, Dashboard, etc.)
│ ├── redux/ # Redux store & slices
│ └── utils/ # Utility functions (permissions)
├── public/ # Public assets
└── package.json # Project dependencies


## Environment Variables

VITE_API_URL=https://rbac-backend-chi.vercel.app/api


## Scripts

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
