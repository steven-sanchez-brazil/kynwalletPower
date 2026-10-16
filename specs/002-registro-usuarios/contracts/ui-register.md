# Contract: Interfaz de Usuario de la Pantalla de Registro (`/register`)

Contrato observable por el usuario y por las pruebas automatizadas (React Testing Library consulta por rol y nombre accesible). Basado en el frame `04 · Registro` (nodo `31:2`) de Figma y en `spec.md`.

## 1. Estructura de Layout y Responsive Design (FR-012)

| Vista | Ancho de ventana | Distribución observable |
|---|---|---|
| **Desktop** | `≥ 960 px` (`1440 × 1024 px` de referencia) | **2 paneles** en CSS Grid (`43% 1fr` en `960–1279 px`, `620px 1fr` en `≥ 1280 px`): panel izquierdo `BrandPanel` con logo KynWallet, titular `"Tu dinero, sin fronteras."` y tarjeta ilustrativa **KynCard** (`"Kyn Card"`, chip dorado, `"5294  ••••  ••••  4827"`, `"STEVEN LUNA"`, `"12/29"`); panel derecho con `RegisterForm` (`max-width: 400px`). |
| **Mobile** | `< 960 px` (desde `320 px`) | **1 panel adaptativo**: barra superior compacta con el logo KynWallet (titular y tarjeta **KynCard** ocultos) y debajo el panel del formulario de registro sin scroll horizontal. |

## 2. Elementos del Formulario de Registro (`RegisterForm`)

| Elemento | Rol accesible / Etiqueta | Atributos y Notas |
|---|---|---|
| Título | `heading` nivel 1 `"Crear cuenta"` | Subtítulo `"Completa tus datos para comenzar"` |
| Nombre completo | `textbox` `"Nombre completo"` | `type="text"`, `name="fullName"`, `autoComplete="name"`, placeholder `"Ej. Steven Luna"` |
| Correo electrónico | `textbox` `"Correo electrónico"` | `type="email"`, `name="email"`, `autoComplete="email"`, placeholder `"tucorreo@ejemplo.com"` |
| Contraseña | campo con etiqueta `"Contraseña"` | `type="password"` (o `"text"` al alternar), `name="password"`, `autoComplete="new-password"`, placeholder `"Mínimo 8 caracteres"` |
| Visibilidad contraseña | `button` `"Mostrar contraseña"` / `"Ocultar contraseña"` | Independiente para el campo `"Contraseña"`, con `aria-pressed` |
| Confirmar contraseña | campo con etiqueta `"Confirmar contraseña"` | `type="password"` (o `"text"` al alternar), `name="confirmPassword"`, `autoComplete="new-password"`, placeholder `"Repite tu contraseña"` |
| Visibilidad confirmación | `button` `"Mostrar contraseña"` / `"Ocultar contraseña"` | Independiente para el campo `"Confirmar contraseña"`, con `aria-pressed` |
| Términos y condiciones | `checkbox` `"Acepto los términos y condiciones"` | Con soporte de `aria-invalid` y `aria-describedby` cuando hay error inline |
| Botón principal | `button` `"Crear cuenta"` | `type="submit"`. En carga (`submitting`): `aria-busy="true"`, `disabled`, texto `"Creando cuenta…"`. En éxito (`success`): `disabled` hasta completar redirección. |
| Separador | texto `"o continúa con"` | Decorativo |
| Botones sociales | `button` `"Google"`, `button` `"Apple"` | Muestran el aviso `"Próximamente"` sin limpiar el formulario |
| Navegación a Login | `button` (variante `link`) `"Inicia sesión"` precedido por `"¿Ya tienes cuenta?"` | Navega a `/login` |

## 3. Mensajes de Validación Inline (`aria-describedby`)

| Campo | Condición | Texto exacto |
|---|---|---|
| Nombre completo | Vacío o `< 2` caracteres tras `trim()` | `"Ingresa tu nombre completo"` |
| Nombre completo | `> 120` caracteres tras `trim()` | `"El nombre no puede superar 120 caracteres"` |
| Correo electrónico | Vacío tras `trim()` | `"Ingresa tu correo electrónico"` |
| Correo electrónico | Formato inválido o `> 254` caracteres | `"Ingresa un correo electrónico válido"` |
| Contraseña | Vacía | `"Ingresa tu contraseña"` |
| Contraseña | `< 8` caracteres | `"La contraseña debe tener al menos 8 caracteres"` |
| Contraseña | `> 128` caracteres | `"La contraseña no puede superar 128 caracteres"` |
| Confirmar contraseña | Vacía | `"Confirma tu contraseña"` |
| Confirmar contraseña | No coincide con `"Contraseña"` | `"Las contraseñas no coinciden"` |
| Términos y condiciones | No marcado (`false`) al enviar o tras `blur` | `"Debes aceptar los términos y condiciones"` |

## 4. Mensajes Globales (`Alert`)

| Caso | Rol ARIA | Tono | Texto exacto |
|---|---|---|---|
| Registro exitoso (previo a redirección ~1.5 s) | `status` | `success` | `"¡Cuenta creada con éxito! Redirigiendo al inicio de sesión…"` |
| Correo ya registrado | `alert` | `error` | `"No fue posible crear la cuenta con este correo electrónico."` |
| Servicio no disponible | `alert` | `error` | `"Servicio de registro no disponible. Intenta más tarde."` |
| Botones sociales Google / Apple | `status` | `info` | `"Próximamente"` |

## 5. Navegación por Teclado y Foco (FR-005, FR-013)

- **Orden de tabulación**: Nombre completo → Correo electrónico → Contraseña → Mostrar/Ocultar contraseña → Confirmar contraseña → Mostrar/Ocultar confirmación → Casilla Términos y condiciones → Botón Crear cuenta → Google → Apple → Inicia sesión.
- **Gestión de foco ante error de validación en submit**: el foco se mueve automáticamente al primer control con error siguiendo el orden: `fullName` → `email` → `password` → `confirmPassword` → `termsAccepted`.
