# Tasks: Registro de Usuarios — KynWallet

**Rama**: `feature/registro-hector-najarro`  
**Requisitos**: taller de Registro, `spec.md`, `plan.md` y constitución  
**Alcance confirmado**: demo frontend sin backend ni almacenamiento de cuentas. URL propuesta: `/registro`.

## Preparación SDD

- [x] T001 Crear `specs/002-registro-usuarios/spec.md` con los requisitos del PDF.
- [x] T002 Crear `specs/002-registro-usuarios/plan.md` reutilizando el proyecto React existente.
- [x] T003 Confirmar que el registro es demostrativo, sin backend.

## Pruebas primero (TDD)

- [ ] T004 Probar campos obligatorios, formato de correo, contraseña de 8 caracteres, confirmación y términos (`src/domain/registration.test.ts`).
- [ ] T005 Probar formulario y botones sociales (`src/ui/features/register/RegisterForm.test.tsx`).
- [ ] T006 Probar navegación `/registro` ↔ `/login` y mensaje de éxito (`src/App.registration.test.tsx`).

## Implementación

- [ ] T007 Implementar reglas de validación (`src/domain/registration.ts`).
- [ ] T008 Implementar el formulario con componentes existentes (`src/ui/features/register/RegisterForm.tsx`).
- [ ] T009 Adaptar el panel naranja y CSS para escritorio y móvil.
- [ ] T010 Conectar rutas y redirección a `/login` con mensaje de éxito de demostración.

## Comprobación y entrega

- [ ] T011 Ejecutar `npm install` y `npm run test` (las pruebas deben pasar).
- [ ] T012 Ejecutar `npm run build` y, si hay tiempo, `npm run verify`.
- [ ] T013 Revisar manualmente escritorio y móvil; comparar con el frame `04 · Registro` del PDF.
- [ ] T014 Ejecutar `git add .`, `git commit`, `git push` y crear PR hacia el repositorio original.

**Nota**: mantener las tareas sin marcar hasta ejecutar y verificar el código localmente.
