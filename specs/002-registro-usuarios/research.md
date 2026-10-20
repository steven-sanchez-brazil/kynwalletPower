# Research: Registro de Usuarios

**Fecha**: 2026-10-20. Investigación del repositorio instalado y revisión independiente de un agente. No se seleccionan paquetes nuevos ni se afirman propiedades de otras versiones.

## R1. Stack y reutilización

**Decision**: React/TypeScript/CSS Modules actuales, controles existentes, BrandPanel y tokens. Extraer AuthLayout manteniendo presentación del login por defecto; registro oculta todo el panel de marca por debajo de 1024 px y usa dos paneles desde ese ancho.

**Rationale**: LoginScreen usa 960 px y BrandPanel muestra logo móvil; usarlo sin ajuste incumpliría AC-302. El intervalo de tablet permite una decisión técnica de un panel hasta 1024 px.

**Alternatives considered**: copiar estructura/estilos duplica conocimiento; cambiar todos los breakpoints del login introduce regresiones; otra biblioteca no aporta un requisito necesario.

## R2. Navegación y éxito efímero

**Decision**: rutas /register y /login desde App; / sigue siendo login. Contrato de navegación con lectura, suscripción y navigate, adaptador History API/popstate y doble en memoria. Enlaces nativos; interceptar solo activación ordinaria en la pestaña actual. Éxito reemplaza la entrada de registro por /login.

**Rationale**: App solo monta login y package.json no contiene router. El aviso vive en estado transitorio de App, sin query, fragmento, history.state ni almacenamiento; se borra al abandonar esa llegada y no se reconstruye con back/forward o recarga. Nunca viajarán credenciales entre pantallas.

**Alternatives considered**: router nuevo (innecesario para dos pantallas), parámetro de éxito (permite aviso artificial), formulario en historial (retiene datos), recarga por transición (pierde aviso).

## R3. Validación sin regresiones

**Decision**: compartir límites y primitivas en dominio, con perfil de correo explícito para registro y contrato anterior preservado para login. Extraer validadores de campo para reutilización, con tests de caracterización previos. Nombre 1–100 tras trim, correo <=254 tras trim, contraseña/confirmación 8–128 sin trim; coincidencia exacta.

**Rationale**: validation.ts rechaza a@b.c y acepta a@b..com. EC-003 de registro requiere segmentos no vacíos y no exige dos caracteres finales. No se debe endurecer o debilitar silenciosamente el login. Para registro contar caracteres como puntos de código Unicode con una única función de longitud; preservar semántica previa del perfil de login.

**Alternatives considered**: duplicar reglas completas (DRY), validación HTML como autoridad única (omite caso de uso), cambiar validación global sin contrato aprobado (regresión).

## R4. Caso de uso y cancelación

**Decision**: register valida autoritativamente y devuelve resultado discriminado. Inyectar simulador local que solo recibe señal de cancelación y espera 300 ms, sin formulario ni creación de cuentas. Guard síncrono en hook y un identificador de intento evitan duplicados y resultados de solicitudes abandonadas.

**Rationale**: permite verificar fallos sin backend. El botón deshabilitado no impide por sí mismo eventos dentro del mismo ciclo. Cancelar y limpiar al desmontar evita navegación tardía.

**Alternatives considered**: temporizador en componente mezcla responsabilidades; repositorio de cuentas está fuera de alcance; payload de credenciales al temporizador retiene datos innecesariamente.

## R5. Accesibilidad

**Decision**: extender Checkbox aditivamente con required, name, ref, onBlur, disabled, error asociado. TextField debe conservar descripciones externas al añadir error. PasswordField permanece oculto inicialmente; controles de visibilidad con nombres distintos para contraseña y confirmación. Reutilizar Alert para resultado y Button para carga; etiquetas y autocomplete apropiados.

**Rationale**: Checkbox actual solo admite label/checked/onChange. Axe local omite contraste por limitación de jsdom; se requiere revisión manual de geometría, contraste, lector y ampliación.

**Alternatives considered**: controles paralelos duplican; aviso global sin vínculo al campo dificulta corregir; limpiar contraseñas al validar contradice AC-205.

## R6. Observabilidad y privacidad

**Decision**: puerto con eventos enumerados y métricas numéricas; adaptador local conserva contadores y último evento en memoria, sin exportar o persistir. Sin datos de formulario, valores de campos, excepciones crudas ni identificadores personales.

**Rationale**: 5.5/8.7 exigen diagnóstico y ESLint prohíbe consola. Un adaptador acotado evita introducir servicios o almacenamiento, sin detalles técnicos en la experiencia de producto.

**Alternatives considered**: no observar incumple requisitos; consola incumple lint; telemetría remota excede alcance.

## R7. Controles de calidad

**Decision**: mantener Vitest/Testing Library/axe y revisión manual; >=80 % en cuatro métricas y sin bajar cobertura global. Planificar workflow CI de npm verify y auditoría de licencias de producción y desarrollo; no añadir runner de navegador en esta feature.

**Rationale**: package-lock existe y verify está definido. No existe workflow CI en el árbol revisado; audit:licenses hoy usa --production, insuficiente para comprobar todas las dependencias. README documenta aprobación de diseño pendiente para tokens de contraste heredados: no considerarla obtenida.

**Alternatives considered**: sustituir herramientas sin necesidad; declarar conformidad con scripts no ejecutados; asumir que jsdom prueba contraste o disposición real.

## R8. Trazabilidad y rama

**Decision**: mantener rama Git y directorio independientes. Actualizar README y contratos/tests de login afectados durante implementación, referenciando FR-019; no reescribir retrospectivamente su especificación histórica.

**Rationale**: setup-plan devuelve identificador de feature distinto de la rama real. La aclaración de 2026-10-20 autoriza sustituir el placeholder «Regístrate». La nota de conteos del checklist es histórica, anterior a la aclaración; no se altera su prosa dentro de este flujo.

**Alternatives considered**: renombrar rama sin necesidad; dejar expectativas de placeholder incompatibles con el flujo aprobado.

## Resultado

Decisiones resueltas con fuentes locales: package.json, package-lock.json, vite.config.ts, eslint.config.js, README.md, src/App.tsx, src/domain/validation.ts, LoginScreen/BrandPanel y controles/tests existentes. Las auditorías, aprobación heredada y controles de implementación siguen pendientes de ejecución; no son incertidumbres de diseño.

