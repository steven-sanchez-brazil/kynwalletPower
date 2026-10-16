# Implementation Plan: Registro de Usuarios de KynWallet

**Branch**: `feature/registro-pedro-gandola` | **Date**: 2026-10-15 | **Spec**: [spec.md](spec.md).
**Estado**: decisiones técnicas de ejecución; revisión humana final pendiente.

## Summary

Agregar Registro a la demo React existente. Validar datos en el dominio; un caso de uso
verifica la solicitud y llama a un puerto de envío sin argumentos, por lo que ninguna
contraseña llega al adaptador. El adaptador solo espera y devuelve éxito. La UI mantiene
los datos transitoriamente, evita envíos duplicados y descarta las contraseñas al terminar.
La navegación entre `/`, `/login` y `/registro` usa History API, con aviso de éxito solo
en memoria React y protección contra resultados de formularios abandonados.

**Ajuste solicitado el 2026-10-16**: añadir spinner al Button compartido durante loading,
manteniendo la espera simulada predeterminada de 1000 ms, nombre accesible y bloqueo;
movimiento reducido conserva el indicador estático. Aclarar en formulario y confirmación
que el login utiliza cuentas ficticias configuradas, sin vincularlo a los datos del registro.

La referencia visual es la extracción local del nodo `31:2` de la copia de Figma. Se
reutilizan componentes y se añaden variantes de layout para no cambiar el login. Las
adaptaciones de contraste y los estados que no existen en Figma se documentan en research.

## Technical Context

**Language/Version**: TypeScript 5 estricto; Node 24.20.0/npm 11.19.0 instalados.
**Primary Dependencies**: React 19, Vite 8, Inter; ninguna dependencia nueva.
**Storage**: ninguno para Registro; solo estado efímero del formulario y navegación.
**Testing**: Vitest, Testing Library/user-event, axe-core y revisión en navegador.
**Target Platform**: navegadores modernos; desde 320 píxeles, escritorio 1440 × 1024 y zoom 200 %.
**Project Type**: SPA frontend existente, con capas de dominio, aplicación, infraestructura y UI.
**Performance Goals**: simulación predeterminada de 1000 ms, sin llamadas de red del registro.
**Constraints**: conservar login y rama; no backend ni persistencia; WCAG 2.1 AA; TDD;
conservar cobertura configurada >=80 % en todas las métricas.
**Scale/Scope**: una nueva pantalla, dos destinos de navegación, envío simulado y estados del formulario.

## Constitution Check

| Principio o sección | Comprobación del diseño | Resultado |
| --- | --- | --- |
| I. TDD | Pruebas de reglas, contrato y UI antes de producción; evidencia Rojo/Verde por lote | Conforme; ejecución por verificar |
| II. SOLID | Caso de uso depende de `RegistrationGateway`; composición en main; UI inyectable | Conforme |
| III. Clean Architecture | Reglas puras en dominio; puerto en aplicación; temporizador en infraestructura | Conforme; ESLint verifica importaciones |
| IV. DRY/KISS/YAGNI | Reutilizar validación de credenciales y componentes; History API sin librería | Conforme |
| V. Seguridad | Validación de la solicitud; puerto sin datos; sin URL/storage/logs con datos personales; errores tipados y visibles | Conforme al alcance de demo |
| VI. BRD/ARD | Alcance del taller y spec; no se identificaron BRD/ARD adicionales | No aplica documento externo no provisto |
| 7. Dependencias | No añadir paquetes; mantener lockfile y auditorías existentes | Conforme |
| 8.1/8.2 Calidad | Pruebas con trazabilidad, cobertura, tipos, lint y formato | Verificar al finalizar |
| 8.3 Documentación | Plan, research, modelo, contratos, quickstart y README actualizados | Incluido |
| 8.4 Accesibilidad | Componentes nativos, foco y errores asociados; contraste calculado y revisión de teclado/layout real | Incluido; axe sin color no basta |
| 8.5/8.6 Reutilización/diseño | Variantes de componentes existentes; diferencias visuales justificadas en R3 | Revisión de diseño final pendiente |
| 8.7 Observabilidad | Estado ocupado y errores explícitos; evidencias de pruebas, sin telemetría ni datos sensibles | Proporcional a demo sin servicio protegido |
| 9. Gobierno | Requisitos -> tareas -> pruebas; autorización de ejecución completa registrada; aprobación humana y code review no se simulan | Pendientes de revisión final/integración |

**Re-check tras diseño**: modelo y contratos mantienen estas conclusiones. No se rebaja la
Constitución ni se incorpora una excepción de seguridad. La adecuación de colores necesaria
para AA se incluye en la revisión final de diseño, conforme a la autorización del usuario.
No se publica ni se integra el cambio sin esa revisión.

## Project Structure

### Documentation (this feature)

```text
specs/002-registro-usuarios/
├── spec.md
├── constitution-review.md
├── plan.md
├── research.md
├── data-model.md
├── contracts/registration.md
├── quickstart.md
├── tasks.md
├── checklists/requirements.md
└── design/                 # extracción recibida, conservada como fuente
```

Consignas y bitácora permanecen fuera de specs, en `harness/sdd/`. El apunte del usuario
y la autorización del ciclo se referencian en `harness/sdd/method-reference.md`.

### Source Code (repository root)

```text
src/
├── domain/registration.ts                 # valores, errores y resultado de dominio
├── domain/validation.ts                   # reglas de acceso y registro compartidas
├── domain/messages.ts                     # textos de acceso y registro
├── application/register.ts                # caso de uso tipado, puerto inyectado
├── application/ports/RegistrationGateway.ts
├── infrastructure/SimulatedRegistrationGateway.ts
├── ui/navigation/useNavigation.ts         # estado de ruta, historial y vigencia de sesión
├── ui/components/NavigationLink/          # enlaces nativos con navegación interna opt-in
├── ui/components/Checkbox/                # añadir error, ref, suffix y atributos nativos
├── ui/components/PasswordField/           # nombres de visibilidad distinguibles
├── ui/layout/BrandPanel/                  # variante registration, default login
├── ui/features/login/                    # enlace a Registro; resto del flujo se conserva
├── ui/features/registration/              # formulario, reducer/hook y estilos
├── App.tsx                               # composición de vistas y aviso transitorio
└── main.tsx                              # inyección de los dos casos de uso
```

Pruebas junto al código. Un helper de pruebas de Registro usa datos ficticios exclusivos
de pruebas; ninguna cuenta real o secreto se incorpora al repositorio.

**Structure Decision**: ampliar las capas existentes, sin paquetes, router, librería de
formularios o almacenamiento nuevo. No copiar el código React/Tailwind devuelto por Figma.

Revisión previa al commit del 2026-10-16: se alinean tipos, mensajes y validación con el patrón
del Login original. Detalle en `../003-inicio-billetera/architecture-review.md`; sin cambios de comportamiento.

## Complexity Tracking

| Decisión | Motivo | Alternativa descartada |
| --- | --- | --- |
| Puerto de envío sin argumentos | Permite simular fallos y retraso sin transmitir contraseñas | Backend o repositorio de cuentas, fuera de alcance |
| Sesión de ruta e intento de envío | Evita confirmación tardía incluso antes del desmontaje React | Solo bloquear el botón no cubre abandono |
| Variantes opt-in de layout/marca | Reutilización con geometría de Registro y móvil solo formulario | Duplicar layout o cambiar globalmente el login |
| Texto oscuro en panel de Registro | Mantiene el gradiente y permite contraste AA | Blanco original falla; scrim negro .52 altera todo el fondo |
