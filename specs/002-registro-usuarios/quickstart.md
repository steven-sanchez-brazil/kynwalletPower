# Quickstart: validar Registro de usuarios

La implementación requiere Node 20+, dependencias del lockfile y la rama
`feature/registro-miguel-misericordia`. Registro no usa variables de entorno, backend ni
credenciales.

## Ejecución

```powershell
npm install
npm run dev
```

Abrir `/register`; login permanece en `/login` y `/`.

## TDD y calidad

```powershell
npm run test:watch
npm run test
npm run test:coverage
npm run verify
```

Cada conducta comenzó roja. `verify` cubre lint, formato, tipos, cobertura, build, dependencias,
licencias y secretos, incluida toda la regresión de login.

## Registro de implementación y verificación

- Rama comprobada: `feature/registro-miguel-misericordia`; no se creó ni cambió de rama.
- Regresión base previa: 15 archivos y 111 pruebas verdes.
- Verificación final: `npm run verify` verde el 2026-10-20.
- Suite final: 24 archivos y 162 pruebas verdes.
- Cobertura final: 97.69 % statements, 95.34 % branches, 98.95 % functions y 99.30 % lines.
- Build Vite, auditoría npm (0 vulnerabilidades), licencias y Secretlint: verdes.
- Los avisos de `HTMLCanvasElement.getContext` proceden de axe bajo jsdom y no son fallos.

## Recorridos y límites

Las pruebas cubren envío vacío; nombre 1/80/81 y espacios periféricos; correo 254/255;
contraseña 7/8/128/129 y espacios intactos; confirmación distinta; términos; doble envío; Enter;
Google/Apple no destructivos; error y reintento; navegación y `popstate`; limpieza de secretos;
eventos categóricos sin PII; resultados asíncronos tardíos y desmontaje.

Los recorridos de teclado comprueban orden, activación, foco al primer error y regiones
`status`/`alert`. Axe se ejecutó en los estados inicial, inválido, procesando, no disponible y éxito.

## Responsive y evidencia visual

- [Captura 1440×1024](evidence/registration-1440.png): comparada con Figma `31:2`.
- [Captura móvil fiable a 500 px](evidence/registration-mobile-500.png): solo identidad y
  formulario, sin panel promocional ni desbordamiento.
- Matriz revisada por reglas CSS: padding 16 bajo 480, contenido limitado a 400, panel promocional
  oculto bajo 960, columnas 43/57 desde 960, panel fijo de 620 desde 1280 y `min-width: 0` en toda
  la cadena de contenedores. Los botones sociales se apilan bajo 480.
- Chrome headless en Windows impone una composición mínima de 500 CSS px; no se conserva una
  captura rotulada falsamente como 320. La cobertura desde 320 se valida por restricciones CSS,
  estructura flexible y ausencia de anchos mínimos mayores al viewport.
- En altura reducida el documento desplaza verticalmente; no fija ni corta el formulario.

## Reconsulta Figma y diferencias aprobadas

Figma MCP se reconsultó directamente para `04 · Registro`, nodo `31:2`, antes del cierre. Se
confirmaron: lienzo 1440×1024, panel 620, formulario 400, inicio del formulario x=820/y=140,
campos 400×52 con radio 12 y borde 1.5, checkbox 20/radio 6, botones sociales 192×48 con gap 16,
tarjeta 360×210/radio 22, Inter y gradiente 70.73°. Textos, orden y jerarquía coinciden.

La única desviación intencional es el naranja interactivo/gradiente oscurecido definido en tokens:
prevalece WCAG 2.1 AA sobre los naranjas originales `#FF6B3D`/`#EF5226` de Figma. No se usan URLs
temporales de assets de Figma en runtime.

## Accesibilidad y privacidad

La revisión cubrió operación completa por teclado, foco visible, nombres accesibles, toggles
independientes, asociación de errores, anuncios automáticos, reflujo y zoom mediante estructura
fluida, y contraste de tokens. La semántica para lector se validó con axe y consultas de rol/nombre
accesible; una sesión humana con un lector específico queda fuera de la automatización.

Las pruebas de privacidad inspeccionan DOM fuera de inputs, URL, storage, cookies, consola y
telemetría en éxito, error y abandono.

## Trazabilidad

Los nombres y agrupaciones de pruebas cubren US1–US7, FR-001–FR-030 y SC-001–SC-010. La evidencia
visual cubre FR-001/FR-024–FR-029 y SC-007/SC-010; dominio y aplicación cubren FR-003–FR-021 y
SC-001–SC-004/SC-008/SC-009; UI y accesibilidad cubren FR-022–FR-030 y
SC-005–SC-007/SC-010.
