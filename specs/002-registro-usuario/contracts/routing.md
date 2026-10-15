# Contract: Rutas de la aplicación

**Archivo**: `src/ui/routing/router.ts`

```ts
const ROUTES = { login: '/login', register: '/registro' } as const;
type Route = (typeof ROUTES)[keyof typeof ROUTES];

function navigate(route: Route): void;   // pushState + notificación
function useRoute(): Route;              // ruta actual; redirige rutas desconocidas a /login
```

| ID | Caso | Resultado |
|---|---|---|
| N1 | `navigate('/registro')` | `location.pathname` es `/registro` y `useRoute()` devuelve `/registro` |
| N2 | Atrás del navegador (`popstate`) | `useRoute()` refleja la URL |
| N3 | Ruta desconocida (`/`, `/otra`) | Se reemplaza por `/login` sin agregar historial |
| N4 | Cada ruta | `document.title` es el de data-model.md › Route |
