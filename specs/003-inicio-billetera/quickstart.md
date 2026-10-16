# Validación de Inicio

1. Desde la raíz, `scripts\harness.cmd -Task Dev`; usar una cuenta ficticia configurada en `.env.local`. Registro no crea cuentas para acceder.
2. Abrir `/login`, entrar: debe llegar a `/inicio`, mostrar nombre, saldo, movimientos y aviso de datos ficticios.
3. A 1440×1024 comparar con captura de 03; a 390×844 con 02. Confirmar diferencias de research. Repetir reflujo a 320 y 768 y ampliación equivalente al 200 %, distinguiendo simulación de zoom nativo.
4. Con Tab/Enter/Espacio recorrer controles: foco visible, avisos por acción, saldo intacto, Inicio activo. Verificar nombre largo y que la navegación inferior no tape el final.
5. Cerrar sesión: `/login` vacío. Atrás/adelante, acceso directo a `/inicio` y recarga no recuperan datos. Una autenticación abandonada no abre Inicio.
6. Completar Registro: spinner al menos un segundo, éxito a login; login y registro mantienen validación.
7. `scripts\harness.cmd -Task Verify`. En esta máquina se puede limitar Vitest a dos workers con variable de proceso `VITEST_MAX_WORKERS=2`; restaurarla después.

Registrar evidencia y límites en verification.md. Las pruebas de jsdom no prueban layout, contraste renderizado ni revisión humana.
