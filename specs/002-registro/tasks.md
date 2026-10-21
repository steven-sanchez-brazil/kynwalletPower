# Tasks: Registro de cuenta de KynWallet

**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [ui-registro.md](./contracts/ui-registro.md), [registro-simulado.md](./contracts/registro-simulado.md) y [quickstart.md](./quickstart.md).

**Tests**: obligatorias por la Constitución I y por el pedido de pruebas básicas. Para cada cambio de comportamiento, ejecutar primero la prueba indicada y constatar que falla; después implementar, volver a pasarla y refactorizar sin cambiar el resultado.

**Organization**: fases por historia de usuario en orden de prioridad. Las rutas y la lógica de registro se integran en la SPA React + TypeScript + Vite existente. Las tareas de código apuntan a la raíz del repositorio; este documento y los demás artefactos de planificación permanecen en `specs/002-registro`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede ejecutar en paralelo con otras tareas marcadas [P] de la misma fase, porque modifica archivos distintos y no depende de una tarea incompleta.
- **[USn]**: historia de usuario correspondiente de `spec.md`.
- Los IDs de FR/US citados permiten trazar requisitos a pruebas y código.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: confirmar la línea de base y conservar la configuración existente.

- [X] T001 Ejecutar `npm ci`, `npm run test:coverage`, `npm run lint` y `npm run typecheck` usando `package.json` y registrar los resultados iniciales en `specs/002-registro/quickstart.md` antes de cambiar código; no modificar configuraciones por fallos preexistentes sin identificarlos.

**Checkpoint**: línea de base registrada y dependencias fijadas por `package-lock.json`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: definir una única fuente de reglas de registro y el contrato de simulación que usarán las historias.

- [X] T002 Escribir y ejecutar primero pruebas fallidas de `validateRegistration` en `src/domain/registration.test.ts`: `fullName` obligatorio de 2–100 caracteres tras quitar espacios periféricos, letras Unicode y separadores habituales sin aceptar solo separadores; `email` obligatorio, formato válido y ≤254 caracteres con espacios periféricos ignorados y comparación sin mayúsculas; `password` obligatoria de 8–128 caracteres sin recortar; `confirmPassword` obligatoria e idéntica incluso en espacios y mayúsculas; `acceptedTerms` debe ser `true` por acción explícita (FR-003–FR-007).
- [X] T003 Implementar `RegistrationValues`, `RegistrationErrors` y `validateRegistration` en `src/domain/registration.ts` usando `normalizeEmail`, `EMAIL_MAX_LENGTH`, `PASSWORD_MIN_LENGTH` y `PASSWORD_MAX_LENGTH` de `src/domain/validation.ts`; añadir mensajes propios del registro a `src/domain/messages.ts`, pasar T002 y refactorizar sin duplicar reglas (FR-003–FR-007).
- [X] T004 Definir en `src/application/ports/RegistrationGateway.ts` un puerto inyectable de simulación sin entrada personal ni persistencia, cuyo resultado pueda representar éxito o fallo seguro según `contracts/registro-simulado.md` (FR-010, FR-012, FR-013).

**Checkpoint**: reglas probadas y contrato de simulación listo; ninguna historia usa un backend.

---

## Phase 3: User Story 1 - Completar un registro de demostración (Priority: P1) 🎯 MVP

**Goal**: completar el formulario válido, simular una sola creación y llegar a `/login` con aviso temporal de éxito.

**Independent Test**: ingresar los cuatro campos válidos, aceptar términos y enviar por botón o Enter; verificar progreso, una invocación, `/login`, aviso demostrativo, login vacío y ausencia de datos persistidos.

### Tests for User Story 1 — escribir y comprobar rojo primero

- [X] T005 [P] [US1] Escribir pruebas de contrato del adaptador en `src/infrastructure/InMemoryRegistrationGateway.test.ts`: resuelve éxito tras una espera breve, permite rechazo determinista en pruebas, no hace red ni escribe datos en almacenamiento (US1-1, FR-013).
- [X] T006 [P] [US1] Escribir pruebas del caso de uso en `src/application/registerAccount.test.ts`: valores válidos invocan el puerto una vez sin transferir datos personales, éxito y rechazo se convierten en resultados seguros, y una entrada inválida no invoca el puerto (US1-1, FR-010–FR-013).
- [X] T007 [P] [US1] Escribir pruebas de integración en `src/App.test.tsx` para abrir directamente `/registro`, completar datos válidos, enviar por botón y Enter, bloquear doble envío, navegar a `/login`, mostrar “Registro de demostración completado. No se creó una cuenta real.” y limpiar el aviso al recargar (US1-1–US1-4, FR-010, FR-011).

### Implementation for User Story 1

- [X] T008 [US1] Implementar la simulación local en `src/infrastructure/InMemoryRegistrationGateway.ts` sin `fetch`, base de datos, `localStorage` ni `sessionStorage`; pasar T005 (FR-013).
- [X] T009 [US1] Implementar el caso de uso `createRegisterAccount` en `src/application/registerAccount.ts`: validar antes de llamar al puerto y devolver error genérico ante rechazo, sin enviar nombre, correo, contraseña, confirmación ni aceptación al adaptador; pasar T006 (FR-010–FR-013).
- [X] T010 [US1] Implementar en `src/ui/features/registration/useRegistrationForm.ts` los estados `editing → submitting → success/failure`, valores transitorios, bloqueo de envíos simultáneos y descarte al navegar; conectar el caso de uso (US1-1–US1-4).
- [X] T011 [US1] Crear `src/ui/features/registration/RegistrationForm.tsx` y `src/ui/features/registration/RegistrationForm.module.css` con “Crea tu cuenta”, subtítulo, cuatro campos reutilizando `TextField` y `PasswordField`, casilla, “Crear cuenta” y estado de progreso; los valores son controlados y Enter envía el formulario (FR-002, FR-010, FR-014).
- [X] T012 [US1] Extender `src/ui/layout/BrandPanel/BrandPanel.tsx` y `src/ui/layout/BrandPanel/BrandPanel.module.css` con la variante de texto “Comienza tu camino financiero.” sin alterar el login; crear `src/ui/features/registration/RegistrationScreen.tsx` y su CSS para 620 px de marca y 400 px de formulario en escritorio, ocultando el panel de marca por completo bajo 960 px (FR-001, FR-017).
- [X] T013 [US1] Integrar `/registro`, `/login` y `/` en `src/App.tsx` y componer el puerto en `src/main.tsx`; mantener el aviso de éxito solo en memoria, sin nombre/correo/contraseña en ruta, `history.state` ni almacenamiento, y pasar T007 (FR-011, FR-013).

**Checkpoint**: el flujo válido funciona desde `/registro` hasta `/login` como demostración; la pantalla de login anterior continúa funcionando.

---

## Phase 4: User Story 2 - Corregir datos inválidos (Priority: P1)

**Goal**: mostrar el error de cada control, impedir la simulación y guiar el foco para corregir los datos.

**Independent Test**: enviar vacío y cada valor inválido por separado, comprobar error y permanencia en `/registro`; corregir un valor sin borrar los demás.

### Tests for User Story 2 — escribir y comprobar rojo primero

- [X] T014 [P] [US2] Escribir en `src/ui/features/registration/RegistrationForm.test.tsx` pruebas de envío vacío, nombre fuera de 2–100 tras recorte, correo inválido o >254, contraseña fuera de 8–128, confirmación desigual y términos desmarcados; comprobar que no se invoca la simulación ni se navega (US2-1–US2-6, FR-003–FR-010).
- [X] T015 [P] [US2] Escribir en `src/App.test.tsx` pruebas de errores al salir de cada campo, desaparición al corregir, conservación de otros valores, foco en primer control inválido y anuncio accesible de error; incluir un fallo inesperado de simulación con aviso genérico y reintento en `/registro` (US2-7, FR-009, FR-012, FR-015).

### Implementation for User Story 2

- [X] T016 [US2] Completar `src/ui/features/registration/useRegistrationForm.ts` para manejar `RegistrationErrors` por campo en `blur`, cambio y envío, quitar solo el error corregido y transformar rechazos en `failure` reintentable sin detalles internos; pasar los casos de T014 y T015 (FR-009, FR-012).
- [X] T017 [US2] Completar `src/ui/features/registration/RegistrationForm.tsx` para asociar mensajes con `aria-describedby`/`aria-invalid`, enfocar el primer control inválido en orden visual y anunciar el error global con `Alert`; adaptar `src/ui/components/Checkbox/Checkbox.tsx` solo si se necesita para el error de términos, preservando su uso en login (FR-007, FR-009, FR-015).

**Checkpoint**: todos los intentos inválidos permanecen en registro y explican qué corregir; los rechazos inesperados se pueden reintentar.

---

## Phase 5: User Story 3 - Revisar contraseña y condiciones (Priority: P2)

**Goal**: permitir revisar cada contraseña y consultar términos sin perder valores ni aceptar automáticamente.

**Independent Test**: alternar visibilidad de cada contraseña de forma independiente, abrir y cerrar los términos locales, volver con datos intactos y marcar la casilla explícitamente.

### Tests for User Story 3 — escribir y comprobar rojo primero

- [X] T018 [P] [US3] Escribir en `src/ui/features/registration/RegistrationForm.test.tsx` pruebas de dos controles de visibilidad independientes, etiquetas accesibles “Mostrar/Ocultar contraseña”, apertura de términos sin marcar la casilla y conservación de todos los valores al regresar (US3-1–US3-3, FR-008, FR-014).
- [X] T019 [P] [US3] Escribir en `src/ui/components/Checkbox/Checkbox.test.tsx` pruebas de casilla con etiqueta que contiene un enlace independiente, error anunciado y foco propio, sin romper “Recordarme” en login (FR-007, FR-008, FR-015).

### Implementation for User Story 3

- [X] T020 [US3] Ampliar `src/ui/components/Checkbox/Checkbox.tsx` y su CSS para etiqueta con enlace, `error` y referencia de foco, manteniendo compatibilidad con el login; pasar T019 (FR-007, FR-008, FR-015).
- [X] T021 [US3] Crear `src/ui/features/registration/TermsView.tsx` para importar `specs/002-registro/terminos-y-condiciones.md` con `?raw` de Vite, mostrarlo de forma legible en un diálogo accesible con cierre y retorno del foco al enlace, conservar el formulario y no convertir la consulta en consentimiento; pasar la parte de términos de T018 (FR-008).
- [X] T022 [US3] Conectar en `src/ui/features/registration/RegistrationForm.tsx` las dos instancias de `PasswordField`, el enlace de términos y la casilla extendida; conservar valores al alternar visibilidad o consultar el documento y pasar T018 (FR-007, FR-008, FR-014).

**Checkpoint**: contraseñas y términos se pueden revisar sin modificar la aceptación ni perder información.

---

## Phase 6: User Story 4 - Navegar entre acceso y registro (Priority: P2)

**Goal**: permitir moverse entre ambas pantallas mediante enlaces y rutas navegables.

**Independent Test**: activar “Inicia sesión” desde registro y “Regístrate” desde login; verificar URL, vista correcta, acceso directo, recarga y atrás/adelante.

### Tests for User Story 4 — escribir y comprobar rojo primero

- [X] T023 [US4] Escribir en `src/App.test.tsx` pruebas para “¿Ya tienes cuenta? Inicia sesión” → `/login`, “Regístrate” → `/registro`, acceso directo a ambas rutas, recarga y eventos `popstate` sin perder la pantalla correspondiente (US4-1–US4-2, FR-016).

### Implementation for User Story 4

- [X] T024 [US4] Cambiar `src/ui/features/login/LoginForm.tsx` para que “Regístrate” navegue a `/registro` en vez de mostrar “Función no disponible”; añadir en `src/ui/features/registration/RegistrationForm.tsx` el pie “¿Ya tienes cuenta? Inicia sesión” con vínculo a `/login` (FR-016).
- [X] T025 [US4] Completar `src/App.tsx` con navegación mediante History API y escucha de `popstate` para sincronizar ruta y pantalla; limpiar el aviso temporal al salir de `/login` y pasar T023 sin añadir dependencia de router (FR-011, FR-016).

**Checkpoint**: las dos rutas y los enlaces funcionan sin afectar el flujo de autenticación existente.

---

## Phase 7: User Story 5 - Conocer la disponibilidad del registro social (Priority: P3)

**Goal**: mostrar Google y Apple según el SVG y responder “Próximamente” sin iniciar registro.

**Independent Test**: activar ambos botones por separado; comprobar el texto exacto, valores conservados, misma ruta y cero llamadas al puerto.

### Tests for User Story 5 — escribir y comprobar rojo primero

- [X] T026 [US5] Escribir en `src/ui/features/registration/RegistrationForm.test.tsx` pruebas para Google y Apple: aviso exacto “Próximamente”, formulario intacto, `/registro` sin cambios y ninguna invocación del caso de uso (US5-1, FR-018).

### Implementation for User Story 5

- [X] T027 [US5] Reutilizar `SocialButton`, `Divider` y `Alert` en `src/ui/features/registration/RegistrationForm.tsx`, con el divisor “o regístrate con”, botones Google/Apple de tipo no envío y aviso “Próximamente”; ajustar `RegistrationForm.module.css` al SVG y pasar T026 (FR-001, FR-018).

**Checkpoint**: los botones sociales comunican su estado sin simular una cuenta ni alterar datos.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: cerrar fidelidad visual, accesibilidad, documentación, seguridad y verificación de integración.

- [X] T028 Escribir primero pruebas de accesibilidad para `/registro` vacío, con errores, con aviso y con términos visibles en `src/App.test.tsx` usando `src/test/a11y.ts`; corregir solo los problemas observados en `src/ui/features/registration/` y `src/ui/components/` (FR-015, SC-005).
- [X] T029 Comparar manualmente a 1440 × 1024 `src/ui/features/registration/RegistrationScreen.module.css`, `src/ui/features/registration/RegistrationForm.module.css` y `src/ui/layout/BrandPanel/BrandPanel.module.css` contra `specs/002-registro/registro.svg`; registrar en `specs/002-registro/quickstart.md` diferencias justificadas por contraste AA (FR-001, SC-006).
- [X] T030 Verificar manualmente a 320 px y otro ancho móvil que `src/ui/features/registration/RegistrationScreen.module.css` deja solo el formulario, mantiene orden y foco, y no produce scroll horizontal; registrar el resultado en `specs/002-registro/quickstart.md` (FR-017, SC-005).
- [X] T031 Actualizar `README.md` con rutas `/registro` y `/login`, alcance de la simulación y cómo consultar `specs/002-registro/terminos-y-condiciones.md`; reflejar la nueva navegación también en `specs/001-login-billetera/spec.md` para retirar la nota obsoleta de “Regístrate” no disponible (FR-008, FR-016).
- [X] T032 Ejecutar los escenarios de `specs/002-registro/quickstart.md` y `npm run verify` según `package.json`; resolver fallos de pruebas, cobertura ≥80 %, formato, tipos, build, análisis de secretos, dependencias y licencias antes de integrar (Constitución 1.4, 7, 8.1–8.2, 9.4).
- [X] T033 Conservar el texto aprobado de `specs/002-registro/terminos-y-condiciones.md` al integrarlo en la interfaz y solicitar revisión de código y diseño conforme a `.specify/memory/constitution.md` (8.6, 9.3).

**Checkpoint**: feature verificable y lista para revisión; el texto de términos ya está aprobado para esta demostración.

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup** T001 precede los cambios de código.
2. **Foundational** T002 → T003 y T004; bloquea las historias porque establece reglas y puerto.
3. **US1** T005–T007 pueden escribirse en paralelo; T008 sigue a T005, T009 sigue a T003/T004/T006/T008, T010–T013 integran el flujo válido.
4. **US2** requiere la estructura de formulario de US1; T014/T015 preceden T016/T017.
5. **US3** requiere el formulario de US1; T018/T019 preceden T020–T022. La extensión de casilla se coordina con US2 para no editar el mismo archivo simultáneamente.
6. **US4** requiere las rutas de US1; T023 precede T024/T025.
7. **US5** requiere el formulario de US1; T026 precede T027.
8. **Polish** comienza tras las historias deseadas. T028 precede sus correcciones; T029/T030 son revisiones visuales independientes; T032 sigue a los cambios; T033 conserva la revisión de código y diseño previa a integrar.

### Dependency Graph

```text
Setup T001 → Foundation T002–T004 → US1 (MVP)
                                   ├→ US2 (errores)
                                   ├→ US3 (contraseñas y términos)
                                   ├→ US4 (navegación)
                                   └→ US5 (registro social)
US1–US5 → accesibilidad + revisión visual + documentación → verify + revisión
```

### Parallel Execution Examples

- Tras T004, se pueden redactar en paralelo T005, T006 y T007 porque sus archivos de prueba son distintos; se integran secuencialmente antes de pasar a verde.
- En US2, T014 y T015 cubren archivos de prueba distintos. En US3, T018 y T019 también; las implementaciones que tocan `RegistrationForm.tsx` se hacen en orden.
- Tras US1, las pruebas de US4 y US5 pueden prepararse mientras se implementan las otras historias, pero cualquier edición de `src/App.tsx` o `src/ui/features/registration/RegistrationForm.tsx` se coordina para evitar conflictos.

## Implementation Strategy

**MVP**: completar T001–T013 para demostrar US1: registro válido y redirección segura a `/login`. El dominio compartido ya aplica todas las reglas; los mensajes en línea se completan en US2. Después agregar US2 para hacer útil el manejo de errores, US3 para condiciones y visibilidad, US4 para la navegación en ambos sentidos y US5 para los botones sociales. Cerrar con accesibilidad, comparación visual, documentación y controles corporativos. En cada fase, conservar la evidencia rojo → verde → refactorizar y enlazar pruebas a FR/US.
