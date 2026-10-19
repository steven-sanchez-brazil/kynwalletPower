# Quickstart: Registro de Usuarios de KynWallet

Guía de validación manual una vez implementado el feature. Se reutilizan las instrucciones de
ejecución del login y una cuenta ficticia de `VITE_DEMO_USERS`.

## Prerrequisitos y configuración

Usar Node compatible con Vite 8 (`^20.19.0 || >=22.12.0`; no sirve Node 18 del taller) y npm.
React Router `^7.18.4` ya superó la auditoría de vulnerabilidades y licencias en una copia
temporal (`research.md` R3); al implementar se añade a `package.json` y `package-lock.json` y se
repiten `npm run audit:deps` y `npm run audit:licenses`.

Si una red corporativa intercepta TLS y `npm` falla con `SELF_SIGNED_CERT_IN_CHAIN`, usar
`NODE_OPTIONS=--use-system-ca` (Node 22.15+/24) en lugar de desactivar `strict-ssl`.

```powershell
npm install
Copy-Item .env.example .env.local
```

Editar `.env.local` solo con cuentas ficticias para esta demo. No versionar el archivo y no usar
contraseñas reales: los valores `VITE_*` se incluyen en el bundle cliente.

## Ejecución

```powershell
npm run dev
```

Abrir la URL indicada por Vite. Confirmar que `/` y `/login` muestran el login y `/registro`
muestra el formulario de alta. Las rutas profundas funcionan en `npm run dev` y `npm run preview`;
un alojamiento estático necesita reescribir esas rutas a `index.html`.

Las comprobaciones de escenarios y la trazabilidad con las pruebas están en
[plan.md](./plan.md#test-strategy-y-traceability); los contratos, en
[contracts/](./contracts/) y [data-model.md](./data-model.md).

## Escenarios manuales

| # | Acción | Resultado esperado | Trazabilidad |
|---|---|---|---|
| 1 | Abrir `/registro`, enviar vacío | Errores en nombre, correo, contraseña, confirmación y términos; foco en primer error; no alta | US2-1, FR-006 |
| 2 | Enviar correo inválido, contraseña <8 o confirmación distinta | Mensaje asociado al control; no se crea cuenta | US2-2/3, FR-003/5 |
| 3 | Completar datos válidos sin aceptar términos | Aviso en checkbox; no se crea cuenta | US2-4, FR-005 |
| 4 | Registrar correo configurado o duplicado con mayúsculas/espacios | Error de duplicado en el correo y foco allí; cuenta existente sigue válida | US2-5, FR-007 |
| 5 | Activar Google o Apple | "Próximamente"; campos conservados y sin alta | US3-2, FR-010 |
| 6 | Activar "¿Ya tienes cuenta? Inicia sesión" | Navega a `/login` sin recargar el documento | US3-1, FR-010 |
| 7 | Registrar con correo nuevo, aceptar términos | Cargando ~1 s; navega al login y anuncia confirmación; ninguna contraseña en URL/logs/storage | US1-1, FR-009/13 |
| 8 | Iniciar sesión en la misma ejecución con la cuenta nueva | Login muestra bienvenida con el nombre registrado | US1-2, FR-008 |
| 9 | Recargar e intentar entrar con esa cuenta nueva | No disponible; las cuentas ficticias configuradas aún autentican | US1-3, FR-013 |
| 10 | Probar a 320 px, teclado y axe en ambas vistas | Sin scroll horizontal; orden/foco correctos; sin violaciones automatizadas | US3-3/4, FR-011/12 |
| 11 | En `/login`, activar "Regístrate" | Navega a `/registro` sin recargar | FR-016 |
| 12 | Tras registrarte, recargar `/login` | El aviso de éxito ya no aparece | Spec, Edge Cases |
| 13 | Abrir `/` y luego `/login` | Ambos muestran el login | Alias de ruta |
| 14 | Abrir una ruta desconocida, por ejemplo `/nada` | Vista de ruta no encontrada con enlace a `/login`; sin formulario de registro | Contrato de UI |
| 15 | Enviar dos veces seguidas un registro válido | Se crea una sola cuenta | US1-5 |
| 16 | Tras cambiar de ruta con teclado | El foco queda en el encabezado de la vista nueva | FR-012 |

## Controles automatizados

```powershell
npm run lint
npm run format
npm run typecheck
npm run test:coverage
npm run build
npm run audit:deps
npm run audit:licenses
npm run scan:secrets
```

`npm run verify` ejecuta todos los controles existentes en secuencia. Las pruebas deben cubrir
los escenarios funcionales, integración de cuenta nueva con login y la no persistencia.
