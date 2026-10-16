# Implementation Plan: Inicio de billetera

**Branch**: `feature/registro-pedro-gandola` | **Date**: 2026-10-16 | **Spec**: [spec.md](spec.md)

**Input**: `specs/003-inicio-billetera/spec.md`

## Summary

Reemplazar bienvenida de App por Home responsive, conservando LoginForm reutilizable y Registro. Snapshot local inyectado desde composición, sesión con nombre en memoria, guardia de ruta/generación y controles con aviso de demo. Investigación local delegada de diseño y navegación consolidada en [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript 5.9 estricto, Node 24.20 local.
**Primary Dependencies**: React 19, Vite 8, CSS Modules e Inter existentes; cero dependencias nuevas.
**Storage**: ninguno.
**Testing**: Vitest 5, Testing Library, axe-core; Edge conectado para layout y teclado.
**Target Platform**: navegador, 320–1440 px; breakpoint 1024 px y reflujo a 200 %.
**Project Type**: demo web cliente.
**Performance Goals**: Home síncrono al concluir el acceso existente; sin carga/red adicional.
**Constraints**: sin backend, sesión persistente ni operaciones reales; TDD, WCAG AA, cobertura >=80 % y controles vigentes.
**Scale/Scope**: un Inicio con dos variantes, cinco movimientos fijos; preservar pantallas existentes.

## Constitution Check

Gate inicial y posterior al diseño original: PASS para proceder, con [constitution-review.md](constitution-review.md) por principio. La corrección posterior del usuario restituye blancos de Figma y registra la discrepancia de contraste; no se declara AA completo. La aprobación de integración sigue pendiente y no se sustituye por este gate del agente.

## Project Structure

### Documentation (this feature)

`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/ui.md`, `quickstart.md`, `tasks.md`, `verification.md`, `evidence/` en `specs/003-inicio-billetera/`. Consignas y bitácora en `harness/sdd/`.

### Source Code (repository root)

```text
src/domain/wallet.ts
src/application/ports/WalletGateway.ts
src/application/readWalletOverview.ts
src/infrastructure/DemoWalletGateway.ts
src/ui/features/home/WalletHome.tsx
src/ui/features/home/WalletHome.module.css
src/ui/navigation/useNavigation.ts
src/ui/features/login/{LoginForm,useLoginForm,loginReducer}.ts[x]
src/{App,main}.tsx
```

**Structure Decision**: conservar capas y controles existentes. El puerto síncrono devuelve snapshot readonly; se resuelve en main y se pasa a App. El callback opcional de LoginForm evita acoplarlo a rutas. Navegación mantiene una sola autoridad de sesión y generación.

## Verificación y decisiones visuales

Pruebas con IDs FR/US: fixture y puerto, contenido/avisos/semántica, login→Inicio, cierre/directo/historial/restauración y carrera, limpieza de contraseña. Rojo registrado antes de código. Regresión completa y verify al finalizar; dos workers por recursos de máquina, sin relajar tiempos ni umbrales.

CSS fluido corrige desborde de KPI del Figma. Según la corrección posterior del usuario, texto blanco sobre gradiente en Inicio; se conserva brand800 para texto naranja sobre gris/flecha sobre rosa y neutral700 para secundarios sobre gris. El blanco sobre el extremo claro del gradiente tiene contraste 2.314:1: esta elección visual solicitada no permite declarar AA completo. Cabecera y saldo comparten fondo que crece con el nombre. Sidebar sticky de 100dvh con menú flexible, min-height:0, overflow-y:auto y perfil fuera del área desplazable. SVG específicos por frame sustituyen el símbolo CSS aproximado de Inicio y el símbolo de Login reutilizado incorrectamente en Registro. Personalización, logout y aviso de demo se conservan.

## Complexity Tracking

Sin violaciones ni complejidad excepcional. No se agregan router, store, sistema de estilos o librerías financieras.

## Revisión frente a la base original

La [revisión de arquitectura](architecture-review.md) compara las cuatro capas con el commit
original y alinea la organización de Registro: resultado de dominio, mensajes y validaciones
en los mismos módulos conceptuales que Login. Sin nuevos comportamientos o dependencias.
