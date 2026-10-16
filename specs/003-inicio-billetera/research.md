# Research: Inicio

Fecha: 2026-10-16. Investigación local: código del repositorio y extracción proporcionada, sin dependencias nuevas.

## Sesión y navegación

**Decision**: ampliar `useNavigation` con nombre efímero y `loginCompleted(session, name)`; conservar contador y ref que invalidan respuestas antes del commit. `LoginForm` comunica éxito mediante callback opcional después de comprobar montaje. Cualquier salida/popstate/pagehide/restauración limpia sesión; `/inicio` sin nombre se reemplaza por `/login`.

**Rationale**: la investigación delegada en `research_navigation` confirma que el control existente de Registro cubre carreras en la misma tanda. La aplicación nunca renderiza Home sin sesión. La contraseña se vacía en el reducer al éxito.

**Alternatives considered**: router nuevo, tokens, almacenamiento o wrapper del gateway que abra Home antes de comprobar montaje: complejidad o sesión tardía innecesarias. Se conserva WelcomeView como comportamiento aislado del componente LoginForm; App usa el callback y abre Inicio.

## Datos y capas

**Decision**: contrato readonly WalletOverview en dominio; puerto síncrono `WalletGateway.getOverview`, caso de uso `readWalletOverview`, adaptador estático con muestras Figma. Composición en main, snapshot inyectado a App y Home.

**Rationale**: no hay servicio remoto, cálculo contable ni carga adicional que simular. Una única fuente comparte datos entre variantes. No requiere stores, dependencias ni llamadas financieras.

**Alternatives considered**: fixtures en JSX duplicadas, imports de infraestructura en UI, peticiones artificiales: contradicen DRY, capas o alcance.

## Diseño y accesibilidad

**Decision**: CSS Modules, grillas fluidas, breakpoint 1024 px. A 1440: lateral 260 px, contenido con márgenes 40 px, indicadores 4 columnas y contenido principal 2 columnas. A menos de 1024: cabecera naranja, saldo, panel flotante de acciones, cuatro movimientos y navegación inferior. Los bloques secundarios se ocultan con display:none.

**Rationale**: el diseño absoluto desborda el cuarto indicador. Reflujo evita el defecto y permite 320 px. Reutilizar Inter y tokens. Nombres largos ajustan líneas. Se agregan foco, aviso live y Cerrar sesión sin inventar pantallas.

**Alternatives considered**: copiar JSX/Tailwind del MCP o posiciones absolutas; ambos introducen estructura/dependencias y defectos evitables. Las formas decorativas se reproducen en CSS; los símbolos de marca usan SVG con la geometría exacta de cada frame tras la revisión del usuario.

**Diferencias vigentes**: secundarios neutral700 y naranja brand800 sobre gris; brand800 en flecha sobre rosa; indicadores ajustados al ancho; titular autenticado y descriptor de demo; logout y aviso de demo. Barras ilustrativas sin inferir porcentajes contables. La decisión inicial de texto oscuro sobre gradiente fue rechazada por el usuario y queda sustituida por la siguiente corrección.

## Corrección visual solicitada el 2026-10-16

**Decision**: blancos de Figma en sidebar/perfil, cabecera/saldo/moneda móvil y tarjeta de Inicio. Mantener barra superior de escritorio oscura sobre blanco y KPI con su naranja, según las capturas. La solicitud de revisar Login/Registro especifica «el icono nomás»: no se cambian sus titulares u otros estilos.

**Rationale**: instrucción explícita del usuario sobre fidelidad visual. El blanco sobre #ff8a65 mide 2.314:1; se registra la discrepancia con WCAG sin cambiar por negro ni declarar AA completo. Esta decisión prevalece sobre la preferencia previa del agente, sin enmendar silenciosamente la Constitución.

**Decision**: sidebar sticky de alto 100dvh y menú interno que se contrae y desplaza; logo y perfil no se contraen. Perfil al pie visible. El contenido principal puede desplazarse sin arrastrar el lateral. Pruebas en ventana de 600 y 320 px de alto y teclado.

**Decision**: Login conserva su SVG 20×44; Registro usa elipse 10×28 y círculo 14×14 desplazado (4,12), conjunto 18×28; Inicio elipse 14×22 y círculo 14×14 desplazado (6,8), conjunto 20×22. Fuente: metadatos y SVG locales de los frames, no símbolos nuevos.
