# Plan de implementación: Registro de usuarios

**Rama**: `feature/registro-henry-ilizarbe` | **Fecha**: 2026-10-16  
**Especificación**: [spec.md](./spec.md)  
**Estado**: implementado y verificado localmente; revisión humana previa a integración pendiente

## Resumen

Añadir la pantalla del frame 04 Registro al frontend de KynWallet. El dominio valida nombre,
correo, contraseña, confirmación y términos. Un caso de uso inyectado prepara la cuenta y usa
un puerto de registro. El adaptador en memoria existente comparte las cuentas con login.
La UI reutiliza campos, botones, checkbox, alertas, tokens y panel de marca del repositorio.
El registro válido termina en `/login` con un mensaje de éxito; los proveedores sociales
ejecutan el aviso exacto `Próximamente`.

No se añade router, dependencia, servicio remoto ni almacenamiento persistente. `/` mantiene
el login existente, `/login` lo hace explícito y `/register` presenta el nuevo formulario.

## Contexto técnico

| Aspecto             | Decisión                                                                |
| ------------------- | ----------------------------------------------------------------------- |
| Lenguaje            | TypeScript 5.9 con comprobación estricta                                |
| Interfaz            | React 19, Vite 8 y CSS Modules existentes                               |
| Pruebas             | Vitest 5, Testing Library, user-event, jsdom y axe-core existentes      |
| Plataforma          | SPA para navegador, desde 320 px hasta escritorio                       |
| Datos               | Instancia en memoria durante la vida de la página; sin persistencia     |
| Rendimiento         | Validación local inmediata; un solo envío activo con feedback visible   |
| Dependencias nuevas | Ninguna                                                                 |
| Cobertura           | Umbrales existentes de 80 %; no reducir cobertura global sin aprobación |
| Fuentes             | Taller PDF, captura de frame 04, feature 001 y Constitución 1.0.0       |

## Verificación de la Constitución

Esta tabla revisa el diseño; no representa controles ejecutados ni aprobación de integración.

| Principio o control          | Aplicación concreta                                                                                                     | Verificación prevista                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| I. TDD                       | Escribir primero pruebas de validación, caso de uso, adaptador y UI; observar fallo antes de producción.                | Registrar Rojo → Verde en `tasks.md`; ejecutar regresión.     |
| II. SOLID                    | `RegistrationGateway` específico e inyectado; componentes con una responsabilidad; raíz de composición en `main.tsx`.   | Revisar contratos e imports.                                  |
| III. Clean Architecture      | Dominio puro; aplicación depende de contratos; infraestructura y React en el exterior.                                  | ESLint y revisión de dependencias.                            |
| IV. DRY/KISS/YAGNI           | Compartir política de correo y contraseña con login; reutilizar UI y adaptador; sin nuevas librerías.                   | Revisión del diff.                                            |
| V. Seguridad                 | Validar antes del puerto; confirmación y términos no se guardan; solo datos ficticios en memoria; errores sin secretos. | Pruebas del puerto, inspección y escaneo de secretos.         |
| VI. BRD/ARD                  | PDF como fuente de negocio; no hay BRD/ARD separados encontrados.                                                       | Trazabilidad de requisitos en `spec.md`.                      |
| 7. Dependencias              | Mantener versiones y archivo de bloqueo existentes, sin incorporar paquetes.                                            | Auditorías de dependencias y licencias.                       |
| 8.1 Pruebas                  | Unitarias y pruebas de integración/contrato proporcionales; nombres REG-FR/REG-US.                                      | Suite y cobertura existentes.                                 |
| 8.2 Estilo                   | Convenciones actuales de TypeScript, React y CSS Modules.                                                               | Lint, Prettier, tipos y build.                                |
| 8.3 Documentación            | Especificación, plan, tareas, contratos y README en el mismo cambio.                                                    | Revisión documental contra implementación.                    |
| 8.4 Accesibilidad            | Campos etiquetados, foco, asociación de errores, aviso de resultado y contraste AA.                                     | Axe, teclado y revisión visual.                               |
| 8.5/8.6 Reutilización/diseño | Reutilizar tokens y componentes de login; variante del panel de marca para registro.                                    | Comparación con la captura PDF y revisión de contraste.       |
| 8.7 Observabilidad           | No introducir telemetría de formularios ni logs de datos personales en esta demo; estados explícitos de error.          | Inspección de logs/URLs/almacenamiento.                       |
| 9.2 Trazabilidad             | REG-FR → historia → tarea → prueba → resultado.                                                                         | Matriz de spec y registro en tareas.                          |
| 9.3/9.4 Revisión y controles | Dejar el cambio local revisable en la rama indicada; sin commit/push de este trabajo.                                   | Ejecutar `npm run verify`; revisión humana previa a integrar. |

**Resultado del diseño**: consistente con la arquitectura existente, con los límites de demo
documentados abajo. No se declara completada la revisión por un tercero ni los controles.

## Decisiones y límites

1. **Registro demostrable sin backend**. `InMemoryAuthGateway` implementa autenticación y
   registro; ambos casos de uso reciben la misma instancia desde `main.tsx`. Es la opción
   más pequeña que permite registrar e iniciar sesión sin introducir un repositorio adicional.
2. **Contrato estrecho**. `RegistrationInput` incluye confirmación y aceptación para validar;
   el puerto recibe `RegistrationAccount` con nombre, correo normalizado y contraseña.
   `RegistrationResult` distingue éxito, errores de entrada, duplicado y no disponible.
3. **Configuración ausente**. El login conserva `unavailable` si no hay cuentas configuradas;
   el registro puede crear la primera cuenta de la instancia, habilitando su login posterior.
4. **Navegación mínima**. La aplicación resuelve las rutas del flujo con la API de historial
   del navegador, permitiendo enlaces reales y Atrás/Adelante sin dependencia de router.
   La confirmación de éxito es transitoria y no contiene datos personales en la URL.
5. **Diseño obtenido del PDF**. El plugin Figma se instaló y se intentaron
   `get_design_context` y `get_screenshot` para el nodo `31:2`; ambos rechazaron el acceso
   porque la cuenta no tiene permiso de edición del archivo. Se utiliza la captura de la
   página 1 del PDF, alternativa permitida por el tip de la página 4. No se afirma extracción MCP,
   medición exacta del frame ni fidelidad píxel a píxel.
6. **Accesibilidad y color**. Se reutilizan tokens accesibles existentes y se ajusta la
   variante del gradiente del panel de registro para mantener contraste del texto. La
   Constitución 8.4 exige AA; cualquier diferencia visual debe quedar documentada y revisada
   por el responsable de diseño antes de integrar, conforme a 8.6.
7. **Seguridad de la demo**. Las contraseñas ficticias viven temporalmente en memoria como
   ocurre en el login existente; esto no constituye autenticación de producción. Producción
   requeriría servicio seguro, cifrado, hashing de contraseñas y revisión de seguridad.
8. **Formato compatible con el checkout de Windows**. Se añade `endOfLine: "auto"` a
   `.prettierrc.json`: la primera ejecución de `verify` identificó 46 archivos previos por
   CRLF, coherente con `core.autocrlf=true`. Esta configuración conserva el estilo de cada
   archivo y evita reformatear masivamente código intacto. `npm run format` pasa tras el
   ajuste, y la segunda ejecución completa de `verify` terminó con código 0.

## Estructura

```text
specs/002-registro-usuarios/
├── spec.md
├── plan.md
├── tasks.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── registration-gateway.md
    └── ui-registration.md

src/
├── domain/
│   ├── registration.ts
│   ├── registrationValidation.ts
│   ├── registrationValidation.test.ts
│   ├── validation.ts                # política compartida existente
│   └── messages.ts                   # textos existentes reutilizados
├── application/
│   ├── registerAccount.ts
│   ├── registerAccount.test.ts
│   └── ports/RegistrationGateway.ts
├── infrastructure/
│   ├── InMemoryAuthGateway.ts       # también registro, una instancia compartida
│   └── InMemoryAuthGateway.test.ts
├── ui/
│   ├── features/register/
│   │   ├── RegisterForm.tsx
│   │   ├── RegisterForm.test.tsx
│   │   └── RegisterScreen.tsx
│   ├── features/login/              # enlace y aviso de confirmación
│   ├── components/NavigationLink/   # navegación SPA mediante enlaces reales
│   ├── navigation.ts               # historial y evento de navegación
│   ├── layout/BrandPanel/           # variante de registro
│   └── components/                  # reutilización, sin reglas de negocio
├── App.tsx                         # rutas y estado de confirmación
├── App.test.tsx
└── main.tsx                        # composición e inyección compartida
```

Los nombres de archivos CSS y detalles internos del estado se eligen al implementar sin
alterar los contratos. Las pruebas se ubican junto al código, siguiendo el proyecto.

## Secuencia y comprobaciones

1. Revisar especificación → plan → tareas antes de modificar producción.
2. Escribir y ejecutar las pruebas de cada cambio para observar el estado rojo.
3. Implementar dominio y caso de uso; después adaptador y UI reutilizada.
4. Integrar navegación, mensaje y dependencia compartida; ejecutar pruebas verdes.
5. Revisar a 1440, 375 y 320 px; teclado y accesibilidad; ajustar solo con evidencia.
6. Ejecutar controles existentes y registrar resultados reales, límites y pendientes.

## Complejidad y pendientes de integración

No se justifica una capa, repositorio, router o dependencia adicional. La memoria compartida
es necesaria para REG-FR-018 y reemplaza una simulación de éxito sin cuenta utilizable.

La revisión humana independiente y la revisión de diseño/seguridad exigidas por la
Constitución siguen siendo necesarias antes de integrar. El cambio local no se atribuye esa
aprobación. Los controles automatizados terminaron correctamente: `npm run verify` devolvió
código 0 con 196 pruebas aprobadas en 20 suites. La cobertura global es 99.37 % de sentencias,
98.51 % de ramas y 100 % de funciones/líneas. Los resultados detallados y la revisión visual
están en `tasks.md`.
