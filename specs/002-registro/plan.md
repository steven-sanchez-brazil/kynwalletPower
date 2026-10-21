# Implementation Plan: Registro de cuenta de KynWallet

**Branch**: `feature/registro-sebastian-zmener` | **Date**: 2026-10-20 | **Spec**: [spec.md](./spec.md)

**Input**: Especificación `specs/002-registro/spec.md` y los lineamientos del pedido de `/speckit-plan` del 2026-10-20. Los lineamientos más recientes fijan la redirección a `/login` tras el éxito y el aviso “Próximamente” para Google y Apple; la especificación se actualizó para reflejarlos.

## Summary

Añadir `/registro` a la aplicación React + TypeScript + Vite existente. En escritorio se reproduce el SVG local con panel de marca de 620 px a la izquierda y formulario de 400 px a la derecha; en móvil se muestra solo el formulario. Los cuatro campos y la aceptación de términos se validan en línea. “Crear cuenta” ejecuta una simulación local, bloquea envíos repetidos y, si termina correctamente, navega a `/login` con un mensaje de éxito que aclara que no se creó una cuenta real. Google y Apple muestran “Próximamente”. Se reutilizan controles, estilos, pruebas y separación de capas del login.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.3, Node ≥20 según `package.json` existente.  
**Primary Dependencies**: React, React DOM, Vite 8, Inter variable y los componentes compartidos ya instalados; sin dependencias nuevas previstas.  
**Storage**: Estado de formulario y confirmación solo en memoria durante la navegación SPA; sin backend, base de datos, API externa, `localStorage` ni `sessionStorage`.  
**Testing**: Vitest 5, React Testing Library, user-event, jsdom y `axe-core` con el helper existente; cobertura del repositorio ≥80 % en líneas, ramas, funciones y sentencias.  
**Target Platform**: Navegadores modernos, ancho desde 320 px. Rutas SPA `/login` y `/registro`; `/` mantiene acceso al login.  
**Project Type**: SPA frontend existente.  
**Performance Goals**: Resultado visible en ≤2 s tras un envío válido; interacción de registro en <2 min.  
**Constraints**: WCAG 2.1 AA, contraseña no persistida ni registrada, dos paneles en escritorio y solo formulario en móvil, sin desplazamiento horizontal.  
**Scale/Scope**: Una pantalla nueva y navegación entre dos pantallas; reutilización de seis componentes de UI y de los tokens existentes.

## Constitution Check

*Gate previo a investigación y revisión posterior al diseño: aprobado para planificar. El contenido de términos fue aprobado para la demostración el 2026-10-20; los controles de integración siguen pendientes hasta implementar.*

| Principio / regla | Decisión verificable en este plan | Revisión tras diseño |
|---|---|---|
| I. TDD, 1.1–1.4 | Cada cambio funcional comienza con prueba fallida: validación, caso de uso, navegación, estados, accesibilidad. Ciclo rojo → verde → refactorizar documentado en tareas futuras. | Conforme |
| II. SOLID, 2.1–2.5 | `validateRegistration` solo valida; `createRegisterAccount` solo coordina; la simulación implementa un puerto inyectado; controles reciben props. | Conforme |
| III. Clean Architecture, 3.1–3.5 | Dominio puro, aplicación con puerto, infraestructura en memoria y UI React; ninguna dependencia de dominio hacia UI o navegador. Mantener la regla ESLint existente. | Conforme |
| IV. DRY/KISS/YAGNI, 4.1–4.4 | Reutilizar `TextField`, `PasswordField`, `Checkbox`, `Button`, `SocialButton`, `Divider`, `Alert`, `normalizeEmail`, límites y tokens. Navegación pequeña con History API; sin gestor global ni biblioteca adicional. | Conforme |
| V. Seguridad, 5.1–5.6 | Validar nombre, correo, longitud de contraseñas y aceptación; salida React escapada; no guardar PII ni contraseña en historial, URL, logs o almacenamiento; error genérico; análisis de secretos. | Conforme |
| VI. BRD/ARD, 6.1–6.5 | No se encontraron BRD ni ARD; si aparecen antes de implementar, revisar sus secciones aplicables. | Conforme con supuesto registrado |
| 7. Dependencias | Se usan las versiones y el bloqueo actuales; no añadir paquetes. `npm run audit:deps` y `npm run audit:licenses` antes de integración. | Conforme |
| 8.1 Pruebas | Unitarias de dominio/caso de uso y de contrato de simulación, integración de formulario y rutas, accesibilidad automatizada más revisión manual. | Conforme |
| 8.2 Convenciones | `npm run lint`, `npm run format`, `npm run typecheck`, `npm run build`. | Conforme |
| 8.3 Documentación | Contratos y guía de validación en esta carpeta; actualizar README al implementar la ruta. | Conforme |
| 8.4 Accesibilidad | Campos etiquetados, errores asociados, foco en primer error, alertas anunciadas, teclado y contraste AA. | Conforme con tokens accesibles existentes |
| 8.5 Reutilización | Extender el panel de marca y controles existentes con props mínimas, manteniendo la pantalla de login y sus pruebas. | Conforme |
| 8.6 Sistema de diseño | Inter, geometría y gradiente del SVG; tokens compartidos existentes para controles. Botón y enlaces emplean el naranja accesible ya usado por login. | Conforme con decisión visual documentada en `research.md` |
| 8.7 Observabilidad | Solo eventos técnicos mínimos y estructurados si se requieren; nunca PII, contraseña ni consentimiento. La UI informa estados sin exponer detalles. | Conforme |
| 9.1–9.8 Gobernanza | IDs FR/US en pruebas y tareas; revisión por otra persona y controles `verify` antes de integrar. No se solicitan excepciones constitucionales. | Conforme |

**Contenido de términos**: FR-008 se satisface mediante [`terminos-y-condiciones.md`](./terminos-y-condiciones.md), aprobado por la persona responsable del proyecto el 2026-10-20 para esta demostración. El vínculo del formulario debe abrir este documento o su versión accesible en la aplicación sin marcar la casilla.

## Phase 0: Outline & Research

Las decisiones y alternativas están en [research.md](./research.md). Se inspeccionó el SVG original (1440 × 1024) y la base React existente, incluido el comportamiento actual del enlace “Regístrate” y los componentes compartidos. No quedan dudas técnicas sobre tecnología, navegación o simulación.

## Phase 1: Design & Contracts

- [data-model.md](./data-model.md) define valores, errores, estados y transiciones sin persistencia.
- [contracts/ui-registro.md](./contracts/ui-registro.md) define controles visibles, navegación, foco, mensajes, diseño adaptable y casos de aceptación.
- [contracts/registro-simulado.md](./contracts/registro-simulado.md) define el puerto de simulación y los resultados sin API externa.
- [quickstart.md](./quickstart.md) indica cómo validar manualmente y ejecutar las pruebas al implementar.

**Revisión del gate tras diseño**: las entidades y contratos mantienen el dominio separado de la UI, no añaden dependencias y hacen verificables todos los estados requeridos. El texto local consultable para FR-008 ya está aprobado para la demostración.

## Project Structure

### Documentation (this feature)

```text
specs/002-registro/
├── registro.svg
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── terminos-y-condiciones.md
├── contracts/
│   ├── ui-registro.md
│   └── registro-simulado.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root, fase de implementación)

```text
src/
├── App.tsx                         # selección de /, /login y /registro; flash de éxito en memoria
├── main.tsx                        # composición e inyección de la simulación
├── domain/
│   ├── validation.ts              # reglas comunes de correo/contraseña
│   ├── registration.ts            # valores, errores y validación específica del registro
│   └── messages.ts                # textos compartidos y del registro
├── application/
│   ├── ports/RegistrationGateway.ts
│   └── registerAccount.ts         # caso de uso
├── infrastructure/
│   └── InMemoryRegistrationGateway.ts
└── ui/
    ├── components/                # reutilizar controles existentes; ampliar Checkbox si hace falta
    ├── layout/BrandPanel/         # variante de texto de registro; misma geometría y tarjeta
    ├── features/login/            # enlace a /registro y aviso de éxito en /login
    ├── features/registration/
    │   ├── RegistrationScreen.tsx
    │   ├── RegistrationForm.tsx
    │   ├── useRegistrationForm.ts
    │   └── RegistrationForm.module.css
    └── styles/tokens.css          # solo tokens faltantes comprobados contra SVG
```

Las pruebas `*.test.ts(x)` se ubican junto al código relevante, siguiendo el proyecto. No se crea un segundo proyecto ni se copian las formas vectoriales como una imagen plana que perdería accesibilidad.

**Structure Decision**: extender la SPA y la Clean Architecture ligera existentes. El único estado transversal nuevo es la ruta actual y el aviso temporal de éxito, controlados en la raíz; los valores del formulario permanecen en la pantalla de registro y se descartan al navegar.

## Implementation Sequence (para `/speckit-tasks`)

1. Escribir pruebas fallidas de validación y del contrato de simulación; implementar dominio, puerto, caso de uso y adaptador en memoria.
2. Escribir pruebas fallidas de rutas `/registro` y `/login`, retorno con aviso temporal y navegación atrás/adelante; integrar la raíz de la SPA y actualizar el enlace de login.
3. Escribir pruebas fallidas del formulario: obligatorios, correo, longitud, coincidencia, términos, errores en línea, foco, visibilidad y envíos duplicados; implementar la pantalla reutilizando controles.
4. Escribir pruebas de Google/Apple “Próximamente”, error inesperado y flujo válido con redirección; completar los estados de UI.
5. Ajustar escritorio frente al SVG y móvil con solo formulario; comprobar 320 px, teclado, contraste, lector de pantalla y ausencia de desplazamiento horizontal.
6. Integrar el acceso al texto de términos aprobado para la demostración; actualizar README; ejecutar `npm run verify` y revisión humana antes de integrar.

## Complexity Tracking

No se introduce complejidad adicional ni se solicita una excepción a la Constitución. El uso de History API en la SPA evita una nueva dependencia y satisface las dos rutas requeridas. Los colores interactivos accesibles del proyecto prevalecen sobre el naranja literal del SVG para cumplir WCAG AA; `research.md` deja registrada la diferencia para revisión visual.
