# Quickstart: Pantalla de Registro de Billetera Virtual (KynWallet)

**Feature**: `002-registro-billetera` | **Date**: 2026-10-20 (Actualizado)

Guía práctica para ejecutar la aplicación localmente y validar la pantalla de registro de punta a punta, con énfasis en los botones sociales con alerta "Próximamente" y la redirección al login con el mensaje de registro exitoso.

---

## 1. Prerrequisitos

- **Node.js**: $\ge 20.0.0$ LTS
- **npm**: $\ge 10.0.0$
- **Navegador web moderno**: Chrome, Firefox, Safari o Edge.

---

## 2. Instalación y Configuración Local

1. Clonar el repositorio y situarse en la raíz del proyecto:
   ```bash
   cd kynwalletPower
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno iniciales para la demo:
   ```bash
   cp .env.example .env.local
   ```
   > Nota: `.env.local` inicializa las cuentas de demostración base para el inicio de sesión. Las nuevas cuentas creadas desde la pantalla de registro se agregarán dinámicamente en el almacén en memoria de la sesión.

---

## 3. Ejecución de la Aplicación

- **Modo Desarrollo (con Hot Module Reload)**:
  ```bash
  npm run dev
  ```
  Abre tu navegador en `http://localhost:5173`.

- **Compilación de Producción**:
  ```bash
  npm run build
  ```

- **Vista Previa del Build**:
  ```bash
  npm run preview
  ```

---

## 4. Ejecución de Pruebas y Controles de Calidad

Conforme a la Constitución del proyecto (Principio I y Regla 9.4):

- **Ejecutar pruebas unitarias y de integración**:
  ```bash
  npm test
  ```

- **Ejecutar pruebas con reporte de cobertura**:
  ```bash
  npm run test:coverage
  ```
  *(El umbral exigido de cobertura es $\ge 80\%$ en líneas y ramas)*.

- **Verificación integral de calidad**:
  ```bash
  npm run verify
  ```
  *(Ejecuta linter, verificación de tipos `tsc`, pruebas con cobertura, build de Vite, auditoría de dependencias, licencias y escaneo de secretos)*.

---

## 5. Matriz de Validación Manual Paso a Paso

Valida los siguientes escenarios en el navegador para verificar la fidelidad funcional y de diseño:

| # | Escenario de Prueba | Acción Realizada | Resultado Esperado | Referencia Spec / Requerimiento |
|---|---|---|---|---|
| **1** | **Registro Exitoso y Redirección al Login con Mensaje** | En registro, completar: Nombre: `Carlos Mendoza`, Correo: `carlos@kynwallet.com`, Contraseña: `Password123`, Confirmación: `Password123`, Marcar checkbox y pulsar "Crear cuenta". | Indicador de carga en botón, redirección automática a la pantalla de login, y **en la pantalla de login se despliega de manera visible el alert con el mensaje de registro exitoso** y el correo pre-cargado. | **Requerimiento Usuario, FR-011, FR-012** |
| **2** | **Reutilización de Cuenta en Login** | En la pantalla de login (tras la redirección del paso 1), ingresar la contraseña `Password123` y presionar "Iniciar sesión". | Autenticación exitosa mostrando mensaje de bienvenida "¡Bienvenido, Carlos Mendoza!". | **Requerimiento Usuario, R4** |
| **3** | **Alerta en Botones Sociales (Google y Apple)** | En la pantalla de registro, hacer clic en "Continuar con Google" o "Continuar con Apple". | **Se despliega un alert visible con el texto "Próximamente"** sin recargar la página ni alterar los datos completados en el formulario. | **Requerimiento Usuario, FR-014** |
| **4** | **Campos Vacíos al Enviar** | Abrir la pantalla de registro con campos vacíos y presionar "Crear cuenta". | Detiene el envío, foco en "Nombre completo" y mensajes inline: "Ingresa tu nombre completo", "Ingresa tu correo electrónico", "Ingresa tu contraseña", "Confirma tu contraseña" y "Debes aceptar los términos y condiciones". | **US2-1, FR-008, FR-010** |
| **5** | **Validación de Correo Inválido** | Escribir `carlos@` o `carlos.com` en Correo electrónico y salir del campo (blur). | Mensaje inline: "Ingresa un correo electrónico válido". Al corregirlo a `carlos@test.com`, el mensaje desaparece. | **US2-2, FR-004, FR-009** |
| **6** | **Contraseña Menor a 8 Caracteres** | Escribir `1234567` en Contraseña y salir del campo. | Mensaje inline: "La contraseña debe tener al menos 8 caracteres". | **US2-3, FR-005** |
| **7** | **Contraseñas No Coincidentes** | Escribir `Password123` en Contraseña y `Password456` en Confirmar contraseña. | Mensaje inline: "Las contraseñas no coinciden" en el campo de confirmación. | **US2-4, FR-006** |
| **8** | **Alternar Visibilidad de Contraseñas** | Escribir contraseñas y hacer clic en el icono de ojo de cada campo de contraseña. | El texto enmascarado cambia a texto claro legible de forma independiente por cada campo; el botón anuncia el nuevo estado. | **US3, FR-013** |
| **9** | **Navegación Manual al Login** | Hacer clic en el enlace "¿Ya tienes cuenta? Inicia sesión". | La pantalla cambia inmediatamente al formulario de login sin validar campos ni mostrar errores. | **US4, FR-015** |
| **10** | **Diseño Responsivo (Desktop vs. Mobile)** | Redimensionar la ventana: $\ge 1024$px vs. $< 768$px (o emular móvil de 320px–375px en DevTools). | En escritorio se aprecian 2 paneles (marca con degradado + formulario). En móvil se oculta el panel de marca y solo se visualiza el formulario completo con 0 scroll horizontal. | **US6, FR-016, SC-006** |
| **11** | **Accesibilidad por Teclado (a11y)** | Navegar todo el formulario únicamente con la tecla `Tab` y presionar `Enter` en los campos para enviar. | Foco visible claro en todos los controles, orden de tabulación intuitivo, y envío habilitado con la tecla `Enter`. | **FR-017, FR-019, SC-005** |
