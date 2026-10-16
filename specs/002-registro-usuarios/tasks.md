# Tareas: Registro de usuarios

**Entrada**: [spec.md](./spec.md), [plan.md](./plan.md), Constitución y taller PDF.  
**Rama**: `feature/registro-henry-ilizarbe`  
**Fecha de planificación**: 2026-10-16  
**Estado**: implementación y verificación local completadas. La versión inicial tenía todas
las tareas pendientes; cada cierre posterior se respalda con evidencia real registrada abajo.

`[P]` permite trabajo paralelo en archivos distintos. Los tests son obligatorios por la
Constitución I, aunque la plantilla genérica los considere opcionales. Antes de cada cambio
de comportamiento debe observarse su prueba roja, después verde y finalmente refactorizar.

## Fase 1 — Especificar y diseñar antes de implementar

- [x] REG-T001 Revisar el taller, la Constitución, las plantillas y la feature 001; fijar el alcance en `specs/002-registro-usuarios/spec.md` (todos los REG-FR).
- [x] REG-T002 Revisar `specs/002-registro-usuarios/plan.md` y esta lista antes de modificar producción; confirmar arquitectura y contratos con responsables de dominio/UI (todos los REG-FR).
- [x] REG-T003 [P] Documentar decisiones y límites de referencia visual en `specs/002-registro-usuarios/research.md`, entidades en `data-model.md` y contratos en `contracts/registration-gateway.md` y `contracts/ui-registration.md` (REG-FR-005–021).

**Checkpoint**: especificación → plan → tareas disponibles para revisión. No implica
aprobación de integración ni ejecución de los controles.

## Fase 2 — REG-US2: Validar antes de crear (P1)

- [x] REG-T004 [P] Escribir y ejecutar en rojo `src/domain/registrationValidation.test.ts`: obligatorios, correo, mínimo 8, máximo 128, coincidencia, términos, nombre y límites heredados (REG-FR-006–010).
- [x] REG-T005 Implementar tipos y mensajes específicos en `src/domain/registration.ts`, reglas en `src/domain/registrationValidation.ts`, reutilizando `src/domain/validation.ts` y mensajes compartidos; llevar REG-T004 a verde (REG-FR-006–011).
- [x] REG-T006 Escribir y ejecutar en rojo `src/application/registerAccount.test.ts`: entrada inválida no invoca puerto; normalización; envío mínimo; éxito, duplicado, no disponible y excepción (REG-FR-005, 007, 019, 021).
- [x] REG-T007 Implementar `src/application/ports/RegistrationGateway.ts` y `src/application/registerAccount.ts` por inyección; llevar REG-T006 a verde (REG-FR-005, 018, 019, 021).

**Prueba independiente**: ejecutar los tests de dominio/caso de uso y demostrar cero llamadas
al puerto ante cualquier error de entrada.

## Fase 3 — REG-US1: Crear cuenta y reutilizar el login (P1)

- [x] REG-T008 Escribir y ejecutar en rojo las pruebas de registro en `src/infrastructure/InMemoryAuthGateway.test.ts`: alta→login, correo normalizado duplicado sin sobrescritura, cuentas iniciales y ausencia de configuración (REG-FR-007, 018, 022).
- [x] REG-T009 Ampliar `src/infrastructure/InMemoryAuthGateway.ts` para ambos puertos, conservando la simulación de login; llevar REG-T008 a verde (REG-FR-018, 019, 022).
- [x] REG-T010 [P] Escribir y ejecutar en rojo `src/ui/features/register/RegisterForm.test.tsx`: campos, envío válido, errores, foco, términos, ocupado y doble envío (REG-FR-002–012, 017, 020, 021).
- [x] REG-T011 Implementar `src/ui/features/register/RegisterForm.tsx` y `useRegisterForm.ts` con el caso de uso inyectado y componentes reutilizados; llevar REG-T010 a verde (REG-FR-002–012, 017, 020, 021).
- [x] REG-T012 Escribir y ejecutar en rojo `src/App.test.tsx`: `/register`, `/login`, enlaces, éxito con aviso y alta→login; conservar `/` como login (REG-FR-001, 012, 014, 018, 022).
- [x] REG-T013 Implementar navegación en `src/App.tsx`, enlace/aviso de login y composición compartida en `src/main.tsx`; llevar REG-T012 a verde (REG-FR-001, 012, 014, 018, 022).

**Prueba independiente**: registrar datos ficticios desde `/register`, verificar `/login` con
confirmación y después la bienvenida al autenticarse en la misma pestaña.

## Fase 4 — REG-US3: Presentación, acciones y accesibilidad (P2)

- [x] REG-T014 [P] Escribir y ejecutar en rojo pruebas de Google/Apple con `window.alert('Próximamente')`, enlace `/login`, etiquetas, errores y axe en `src/ui/features/register/RegisterForm.test.tsx` (REG-FR-013, 014, 020).
- [x] REG-T015 Implementar acciones sociales y `src/ui/features/register/RegisterScreen.tsx`, estilos y variante de `src/ui/layout/BrandPanel/BrandPanel.tsx`; conservar tokens accesibles (REG-FR-013–016, 020).
- [x] REG-T016 Añadir pruebas de cualquier extensión necesaria de `Checkbox` o `PasswordField` antes de modificar esos componentes y ejecutar su regresión (REG-FR-003, 011, 020, 022).
- [x] REG-T017 Revisar pantalla a 1440 px, 375 px y 320 px; verificar paneles, visibilidad móvil, desbordamiento, foco, teclado y contraste; registrar referencia PDF y ajustes en `research.md` (REG-FR-015, 016, 020).

**Prueba independiente**: operar controles y navegación con teclado, observar el aviso exacto
de ambos proveedores y verificar la distribución responsive.

## Fase 5 — Documentar y verificar

- [x] REG-T018 [P] Actualizar `README.md` y `specs/002-registro-usuarios/quickstart.md` con ejecución, rutas, demostración completa, pérdida de cuentas al recargar y límites de seguridad (REG-FR-018, 019).
- [x] REG-T019 Ejecutar suite completa y cobertura; asegurar la regresión de login y umbrales del proyecto; registrar números reales abajo (todos los REG-FR).
- [x] REG-T020 Ejecutar `npm run verify` (lint, formato, tipos, cobertura, build, dependencias, licencias y secretos); corregir fallos propios y registrar límites externos o preexistentes sin falsear aprobación.
- [x] REG-T021 Revisar trazabilidad final de requisitos→código→pruebas y actualizar `spec.md`, contratos y tareas según los nombres efectivos.
- [x] REG-T022 Dejar el cambio local revisable en `feature/registro-henry-ilizarbe`, sin commit/push; documentar revisión humana/de diseño requerida antes de integrar.

## Dependencias y paralelismo

- REG-T001 → REG-T002 habilita implementación. REG-T003 puede completarse en paralelo con
  pruebas tras fijar los contratos.
- Dominio (REG-T004–005) precede al caso de uso (REG-T006–007). Infraestructura (REG-T008–009)
  y pruebas UI (REG-T010) pueden avanzar en paralelo sobre contratos confirmados.
- REG-T011 necesita el contrato del caso de uso; REG-T013 integra dominio, infraestructura y
  UI. Mantener separados los responsables de `App.tsx` y `RegisterForm.tsx` evita conflictos.
- Las pruebas de acciones y accesibilidad pueden escribirse junto con REG-T010; no ejecutar
  ediciones simultáneas sobre el mismo archivo. REG-T017 requiere una pantalla ejecutable.
- Los controles finales se ejecutan después de integrar todos los cambios.

## Registro de ejecución

- 2026-10-16 — REG-T001/002: documentos `spec.md`, `plan.md` y `tasks.md` creados en ese
  orden y revisados por el agente coordinador antes de liberar implementación. Contratos y
  rutas confirmados entre responsables de dominio, UI y coordinación. Esta revisión de
  planificación no sustituye la revisión humana independiente previa a integrar.
- 2026-10-16 — REG-T003/018: investigación, modelo, contratos, guía de reproducción y README
  preparados con las limitaciones reales de Figma y de persistencia de la demo.
- 2026-10-16 — REG-T004–009, evidencia del responsable de dominio/infraestructura: fases rojas
  observadas antes de producción; después **47 pruebas nuevas** verdes (23 dominio, 14 caso
  de uso y 10 infraestructura). Cobertura focalizada de los módulos nuevos/modificados:
  **100 %** en sentencias, ramas, funciones y líneas. ESLint, Prettier y TypeScript pasan.
  En esa ejecución todavía faltaba la medición global, registrada después en REG-T019.
- 2026-10-16 — REG-T010/011/014–016, evidencia del responsable de UI: antes de producción,
  `npm test -- src/ui/features/register/RegisterForm.test.tsx src/ui/components/Checkbox/Checkbox.test.tsx src/ui/components/PasswordField/PasswordField.test.tsx src/ui/layout/BrandPanel/BrandPanel.test.tsx`
  terminó con código 1: fallaron cuatro pruebas de extensiones de componentes y faltaba la
  implementación de registro; ocho pruebas existentes pasaron. Tras implementar, el mismo
  comando terminó con código 0: **4 archivos y 33 pruebas verdes**. TypeScript, ESLint
  focalizado, Prettier y `git diff --check` pasan. Estas pruebas incluyen axe y orden de
  teclado; en esa ejecución todavía faltaba la revisión visual, registrada después en REG-T017.
- 2026-10-16 — REG-T012/013, evidencia del coordinador: primero fallaron importaciones de
  registro/navegación aún ausentes y dos pruebas de `LoginForm` por el nuevo enlace esperado;
  tras implementar, **3 suites y 38 pruebas verdes** (App, login y navegación).
- 2026-10-16 — REG-T021: revisión independiente por lectura del código y pruebas de dominio,
  aplicación, adaptador, registro, navegación y composición. No se encontraron defectos
  funcionales bloqueantes del taller; los nombres, rutas y contratos coinciden con los
  documentos. Esta revisión entre agentes no representa aprobación humana de integración.
- 2026-10-16 — REG-T019: suite global del coordinador: **20 suites, 196 pruebas, todas
  aprobadas**. Cobertura: **sentencias 99.37 % (320/322), ramas 98.51 % (199/202), funciones
  100 % (88/88), líneas 100 % (274/274)**. Supera la línea base de sentencias 98.88 % y ramas
  97.58 %; mantiene funciones y líneas al 100 %.
- 2026-10-16 — REG-T017, evidencia del coordinador: Edge real/Playwright a 1440,
  960, 375 y 320 px sin desbordamiento; panel visible desde 960 px y oculto en móvil; fuente
  Inter e imágenes locales cargadas. Capturas inspeccionadas sin recortes. Flujo completo
  alta→confirmación/foco→login→bienvenida→logout, Atrás/Adelante y ambos diálogos exactos
  correctos. Cero escrituras de almacenamiento, cero errores del navegador y cero
  infracciones axe WCAG 2 A/AA y 2.1 AA en móvil con errores. Revisión de teclado real:
  once paradas en el orden esperado y foco del primer error/encabezado comprobados. Se
  conservan tokens accesibles para texto funcional; la tarjeta ilustrativa está marcada
  decorativa y no se atribuye certificación de contraste a su exclusión de axe.
- 2026-10-16 — REG-T020, evidencia parcial del coordinador: build, auditoría de dependencias
  (cero vulnerabilidades), licencias y escaneo de secretos aprobados. La primera ejecución
  de `verify` se detuvo por Prettier en 46 archivos previos con CRLF. Se añadió
  `endOfLine: "auto"` a `.prettierrc.json` por `core.autocrlf=true` sin reformatear el
  repositorio; `npm run format` pasó después. En ese momento quedaba por repetir el control
  completo, cuyo resultado final consta abajo.
- 2026-10-16 — REG-T022: cambios locales disponibles para revisar en la rama solicitada;
  sin commit, push ni pull request. Revisión humana/de diseño previa a integración descrita.
- 2026-10-16 — REG-T020, cierre final del coordinador: **`npm run verify` terminó con código
  0**. Aprobados lint, formato, TypeScript, 196 pruebas/20 suites, cobertura, build, auditoría
  de dependencias (cero vulnerabilidades), licencias y escaneo de secretos. No se añadieron
  dependencias ni se redujo la cobertura global.

## Revisión previa a integración

La Constitución exige revisión independiente y, si aplica, de seguridad y diseño antes de
integrar. Este taller entrega cambios locales; no se presenta esa revisión como concedida.

Los pasos de entrega remota del taller (commit, push y pull request) no se ejecutan como parte
de esta modificación local. Deben realizarse después de revisar el diff y los controles; no
se afirma que la rama haya sido publicada ni que exista un pull request.
